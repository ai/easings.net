# encoding: utf-8

require 'pathname'
ROOT    = Pathname(__FILE__).dirname
CONTENT = ROOT.join('content/')
PUBLIC  = ROOT.join('public/')
LAYOUT  = ROOT.join('layout/')

require 'uglifier'
require 'sprockets'
require 'slim'

require 'compass'
require 'ceaser-easing'
Compass.configuration.images_path = LAYOUT.to_s

require 'coffee_script'

require 'r18n-core'
R18n.default_places = ROOT.join('i18n')

R18n::Filters.add('code') do |text, config|
  text.gsub(/`([^`]+)`/, '<code>\1</code>')
end

R18n::Filters.add('format') do |text, config|
  '<p>' +
    text.gsub(/~([^~]+)~/, '<strong>\1</strong>').gsub("\n", '</p><p>') +
  '</p>'
end

class Pathname
  def glob(pattern, &block)
    Pathname.glob(self.join(pattern), &block)
  end
end

class R18n::TranslatedString
  def link(href, args = { })
    args[:href] = href
    args = args.map { |k, v| "#{k}=\"#{v}\"" }.join(' ')
    self.sub(/\^([^\^]+)\^/, "<a #{args}>\\1</a>")
  end
end

class Easing
  attr_reader :name
  attr_reader :gs_name
  attr_reader :css

  def initialize(attrs)
    @name = attrs['name']
    @gs_name = attrs['gs_name']
    @css  = attrs['css']
  end

  def linear?
    @name == 'linear'
  end

  def in_out?
    @name =~ /InOut/
  end

  def x(t)
    if linear?
      t
    else
      jquery_easings.eval("jQuery.easing.#{@name}(null, #{t}, 0, 1, 1)")
    end
  end

  def dots(count, x, y)
    dots = count.times.to_a.map { |i| (x.to_f / count) * (i + 1) }
    dots.map do |i|
      iy = y - (y * self.x(i / x.to_f))
      [i.round(1), iy.round(1)]
    end
  end

  def bezier
    css.match(/cubic-bezier\(([^\)]+)\)/)[1].gsub(' ', '').gsub('0.', '.')
  end

  def jquery_easings
    @@jquery_easings ||= begin
      require 'execjs'
      js  = 'jQuery = { easing: {},' +
                      ' extend: function (a, b) { jQuery.easing = b } };'
      js += ROOT.join('vendor/jquery.easing.js').read
      ExecJS.compile(js)
    end
  end
end

class Sprockets::Context
  include R18n::Helpers
end

class SassCompiler < Sprockets::SassTemplate
  def sass_options(context)
    {
      filename:    eval_file,
      line:        line,
      syntax:      syntax,
      cache_store: Sprockets::SassCacheStore.new(context.environment),
      importer:    Sprockets::SassImporter.new(context, context.pathname),
      sprockets:   { context: context, environment: context.environment },
      load_paths:  context.environment.paths.map { |path|
        Sprockets::SassImporter.new(context, path)
      }
    }
  end

  def evaluate(context, locals, &block)
    ::Sass::Engine.new(data, sass_options(context)).render
  rescue ::Sass::SyntaxError => e
    context.__LINE__ = e.sass_backtrace.first[:line]
    raise e
  end
end

class CompressedSassCompiler < SassCompiler
  def sass_options(*params)
    super.merge(style: :compressed)
  end
end

class Helpers
  include R18n::Helpers

  attr_accessor :env

  def self.instance(env)
    @@instance ||= self.new
    @@instance.env = env
    @@instance
  end

  def assets
    @sprockets ||= begin
      Sprockets.register_engine '.sass',
        @env == :production ? CompressedSassCompiler : SassCompiler

      Sprockets::Environment.new(ROOT) do |env|
        env.append_path(LAYOUT)
        env.append_path(ROOT.join('vendor'))

        Sass.load_paths.concat(Compass.sass_engine_options[:load_paths])

        if @env == :production
          env.js_compressor = Uglifier.new(copyright: false)
        end
      end
    end
  end

  def all_easings
    @all_easings ||= begin
      YAML.load_file(ROOT.join('easings.yml')).map { |i| Easing.new(i) }
    end
  end

  def css_easings
    all_easings.reject(&:linear?).reject { |i| !i.css }
  end

  def js_easings
    all_easings.reject(&:linear?).reject { |i| i.css }
  end

  def blocked(easings)
    blocks = []
    block  = []
    easings.each do |easing|
      block << easing
      if easing.in_out?
        blocks << block
        block = []
      end
    end
    blocks
  end

  def linear_easing
    @linear_easings ||= all_easings.find(&:linear?)
  end

  def render(file, &block)
    options = { format: :html5, disable_escape: true }
    Slim::Template.new(file.to_s, options).render(self, &block)
  end

  def to_path(dots)
    dots.map { |i| i.join(',') }.join(' ')
  end

  def fonts_list(fonts)
    fonts.map! { |i| i =~ /\s/ ? "\"#{i}\"" : i }
    fonts.uniq.join(', ')
  end

  def production?
    @env == :production
  end

  def each_locale(&block)
    r18n.available_locales.sort { |a, b| a.code <=> b.code }.each do |locale|
      yield(locale.code, locale)
    end
  end

  def include_statistics
    LAYOUT.join('statistics.html').read
  end

  def partial(name)
    render(LAYOUT.join("_#{name}.slim"))
  end
end

def copy_with_extra_js(from, to, js)
  to.open('w') do |io|
    io << from.read.gsub(/<\/title>/, "<\/title><script>#{js}</script>")
  end
end

def build_index(production = false)
  slim   = LAYOUT.join('index.html.slim')
  layout = LAYOUT.join('layout.html.slim')
  helper = Helpers.instance(production ? :production : :development)
  locale = R18n.get.locale.code.downcase

  PUBLIC.mkpath

  file = PUBLIC.join("#{locale}.html")

  file.open('w') do |io|
    io << helper.render(layout) { helper.render(slim) }
  end

  if locale == 'en'
    redirect = helper.assets['language-redirect.js']
    copy_with_extra_js(file, PUBLIC.join("index.html"), redirect)
  end
end

desc 'Build site files'
task :build do
  PUBLIC.mkpath
  PUBLIC.glob('*') { |i| i.rmtree }

  print 'build'

  R18n.available_locales.each do |locale|
    R18n.set(locale.code)
    build_index(true)
    print '.'
  end

  %w( favicon.ico apple-touch-icon.png ).each do |file|
    FileUtils.cp LAYOUT.join(file), PUBLIC.join(file)
  end

  print "\n"
end

desc 'Run server for development'
task :server do
  require 'sinatra/base'

  class EasingsNet < Sinatra::Base
    set :public_folder, nil

    get /^(\/|\/index\.html)$/ do
      build_page('en')
      send_file PUBLIC.join('index.html')
    end

    get '/favicon.ico' do
      send_file LAYOUT.join('favicon.ico')
    end

    get '/apple-touch-icon.png' do
      send_file LAYOUT.join('apple-touch-icon.png')
    end

    get '/:locale' do
      file   = params[:locale]
      file  += '.html' unless file =~ /\.html/

      locale = params[:locale]
      locale = locale.match(/index\.(\w+)\.html/)[1] if locale =~ /index\./

      build_page(locale)
      send_file PUBLIC.join(file)
    end

    def build_page(locale_code)
      R18n.clear_cache!
      R18n.set(locale_code).reload!
      build_index
    end
  end

  EasingsNet.run!
end

desc 'Prepare commit to GitHub Pages'
task :deploy => :build do
  sh ['git checkout gh-pages',
      'git rm *.ico',
      'git rm *.png',
      'git rm *.html',
      'cp public/* ./',
      'git add *.html',
      'git add *.png',
      'git add *.ico'].join(' && ')
end
