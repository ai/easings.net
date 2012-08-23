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

require 'r18n-core'
R18n.default_places = ROOT.join('i18n')

R18n::Filters.add('code') do |text, config|
  text.gsub(/`([^`]+)`/, '<code>\1</code>')
end

R18n::Filters.add('format') do |text, config|
  '<p>' +
    text.sub(/~([^~]+)~/, '<strong>\1</strong>').gsub("\n", '</p><p>') +
  '</p>'
end

class Pathname
  def glob(pattern, &block)
    Pathname.glob(self.join(pattern), &block)
  end
end

class R18n::TranslatedString
  def link(title, href)
    self.sub(title, "<a href=\"#{href}\">#{title}</a>")
  end
end

class Easing
  attr_reader :name
  attr_reader :css

  def initialize(attrs)
    @name = attrs['name']
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
    dots.map { |i| [i, y - (y * self.x(i / x.to_f))] }
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

class Helpers
  include R18n::Helpers

  attr_accessor :path

  def initialize(env)
    @env = env
  end

  def assets
    @sprockets ||= begin
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

  def linear_easing
    @linear_easings ||= all_easings.find(&:linear?)
  end

  def render(file, &block)
    options = { format: :html5, pretty: true, disable_escape: true }
    Slim::Template.new(file.to_s, options).render(self, &block)
  end

  def to_path(dots)
    dots.map { |i| i.join(',') }.join(' ')
  end

  def easing_classes(easing)
    easing.name + (easing.in_out? ? ' in-out' : '')
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

  def easing_example(name = t.howtos.name)
    "<strong>#{ name }</strong>"
  end

  def partial(name)
    render(LAYOUT.join("_#{name}.slim"))
  end
end

def build_file(slim, production = false)
  layout = LAYOUT.join('layout.html.slim')
  helper = Helpers.new(production ? :production : :development)
  locale = R18n.get.locale

  path = slim.relative_path_from(LAYOUT).sub_ext('').sub_ext('').to_s

  subpath = locale.code == 'en' ? '.html' : ".#{locale.code}.html"
  PUBLIC.mkpath
  file = PUBLIC.join(path + subpath)

  helper.path = path

  file.open('w') do |html|
    html << helper.render(layout) { helper.render(slim) }
  end

  file
end

desc 'Build site files'
task :build do
  PUBLIC.mkpath
  PUBLIC.glob('*') { |i| i.rmtree }

  print 'build'

  R18n.available_locales.each do |locale|
    R18n.set(locale.code)
    LAYOUT.glob('**/*.html.slim') do |slim|
      next if slim.basename.to_s == 'layout.html.slim'
      build_file(slim, true)
      print '.'
    end
  end

  print "\n"
end

desc 'Run server for development'
task :server do
  require 'sinatra/base'

  class EasingsNet < Sinatra::Base
    set :public_folder, nil

    get /^(\/|\/index\.html)$/ do
      send_file build_page('index', 'en')
    end

    get '/index.:locale.html' do
      send_file build_page('index', params[:locale])
    end

    def build_page(page, locale_code)
      R18n.clear_cache!
      path = LAYOUT.join("#{page}.html.slim")
      R18n.set(locale_code).reload!
      build_file(path)
    end
  end

  EasingsNet.run!
end

desc 'Prepare commit to GitHub Pages'
task :deploy => :build do
  sh 'git checkout gh-pages && ' +
     'git rm *.html && ' +
     'cp public/*.html ./ && ' +
     'git add *.html'
end
