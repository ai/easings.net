require 'pathname'
ROOT    = Pathname(__FILE__).dirname
CONTENT = ROOT.join('content/')
PUBLIC  = ROOT.join('public/')
LAYOUT  = ROOT.join('layout/')

require 'compass'
Compass.configuration.images_path = LAYOUT.to_s

require 'haml'
require 'haml/template/options'
Haml::Template.options[:ugly] = true

require 'r18n-core'
R18n.default_places = ROOT.join('i18n')

R18n::Filters.add('format') do |text, config|
  '<p>' +
    text.sub(/~([^~]+)~/, '<strong>\1</strong>').
        gsub(/`([^`]+)`/, '<code>\1</code>').
        gsub("\n", '</p><p>') +
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

  def names
    { jquery: @name, sass: (@css ? @name : false), css: @css }
  end

  def x(t)
    if linear?
      t
    else
      jqueryEasings.eval("jQuery.easing.#{@name}(null, #{t}, 0, 1, 1)")
    end
  end

  def dots(count, x, y)
    dots = count.times.to_a.map { |i| (x.to_f / count) * (i + 1) }
    dots.map { |i| [i, y - (y * self.x(i / x.to_f))] }
  end

  def jqueryEasings
    @@jqueryEasings ||= begin
      require 'execjs'
      js  = 'jQuery = { easing: {},' +
                      ' extend: function (a, b) { jQuery.easing = b } };'
      js += ROOT.join('vendor/jquery.easing.js').read
      ExecJS.compile(js)
    end
  end
end

class Helpers
  include R18n::Helpers

  attr_accessor :path

  def initialize(env)
    @env = env
  end

  def assets
    @sprockets ||= begin
      require 'sprockets'
      Sprockets::Environment.new(ROOT) do |env|
        env.append_path(LAYOUT)
        env.append_path(ROOT.join('vendor'))

        compass = Gem.loaded_specs['compass'].full_gem_path
        env.append_path("#{compass}/frameworks/compass/stylesheets")
      end
    end
  end

  def easings
    @easings ||= begin
      YAML.load_file(ROOT.join('easings.yml')).map { |i| Easing.new(i) }
    end
  end

  def render(haml, &block)
    Haml::Engine.new(haml, format: :html5).render(self, &block)
  end

  def to_path(dots)
    dots.map { |i| i.join(',') }.join(' ')
  end

  def class_if(cls, check)
    check ? { class: cls } : {}
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

  def easing_example(name = 'name')
    "<span class=\"easing\">#{ t.howtos[name] }</span>"
  end
end

environment = nil

desc 'Build site files'
task :build do |t, args|
  environment ||= :production

  PUBLIC.mkpath
  PUBLIC.glob('*') { |i| i.rmtree }

  load ROOT.join('easings.rb').to_s
  print 'build'

  layout = LAYOUT.join('layout.html.haml').read
  helper = Helpers.new(environment)

  R18n.available_locales.each do |locale|
    R18n.set(locale.code)

    LAYOUT.glob('**/*.html.haml') do |haml|
      next if haml.basename.to_s == 'layout.html.haml'
      path = haml.relative_path_from(LAYOUT).sub_ext('').sub_ext('').to_s
      file = PUBLIC.join(path + ".#{locale.code}.html")

      helper.path = path

      file.open('w') do |html|
        html << helper.render(layout) { helper.render(haml.read) }
      end

      `gzip --best -c #{file} > #{file}.gz` if helper.production?

      print '.'
    end
  end

  print "\n"
end

desc 'Rebuild files on every changes'
task :watch do
  environment ||= :development
  Rake::Task['build'].execute

  def rebuild
    R18n.get.reload!
    print 're'
    Rake::Task['build'].execute
  rescue Exception => e
    puts
    puts "ERROR: #{e.message}"
  end

  require 'fssm'
  FSSM.monitor(ROOT, '{i18n,layout,easings.yml}/**/*') do
    update { rebuild }
    delete { rebuild }
    create { rebuild }
  end
end

desc 'Upload site files to production server'
task :deploy => :build do
  host = 'easings.net'
  path = '/home/ai/easings.net'
  sh "rsync --recursive --delete --compress --progress --human-readable " +
    "#{PUBLIC} #{host}:#{path}"
end
