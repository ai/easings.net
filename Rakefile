require 'pathname'
ROOT    = Pathname(__FILE__).dirname
CONTENT = ROOT.join('content/')
PUBLIC  = ROOT.join('public/')
LAYOUT  = ROOT.join('layout/')

require 'haml'
require 'r18n-core'
R18n.default_places = CONTENT.join('i18n')

class Pathname
  def glob(pattern, &block)
    Pathname.glob(self.join(pattern), &block)
  end
end

class Helpers
  include R18n::Helpers

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
end

def render(haml, &block)
  Haml::Engine.new(haml, format: :html5).render(Helpers.new, &block)
end

task :clean_public do
  PUBLIC.mkpath
  PUBLIC.glob('*') { |i| i.rmtree }
end

desc 'Build site files'
task :build => :clean_public do
  layout = LAYOUT.join('layout.html.haml').read

  R18n.available_locales.each do |locale|
    R18n.set(locale)

    LAYOUT.glob('*.html.haml') do |haml|
      next if haml.basename.to_s == 'layout.html.haml'
      name = PUBLIC + haml.relative_path_from(LAYOUT).sub_ext('').
        sub_ext(".#{locale.code}.html")

      PUBLIC.join(name).open('w') do |html|
        html << render(layout) { render(haml.read) }
      end
    end
  end
end

desc 'Rebuild files on every changes'
task :watch do
  def rebuild
    puts 'rebuild'
    Rake::Task['build'].execute
  end

  require 'fssm'
  FSSM.monitor(ROOT, '{content,layout}/**/*', directories: true) do
    update { rebuild }
    delete { rebuild }
    create { rebuild }
  end
end
