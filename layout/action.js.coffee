#= require jquery.easing
#= require jquery.hoverIntent

after = (ms, fn) -> setTimeout(fn, ms)

jQuery ($) ->
  easings  = $('.easings li')
  $body    = $('body')
  $window  = $(window)
  isMobile = window.innerWidth <= 480

  # Scroll

  allScroll = null

  hash = (hash) ->
    scroll = $window.scrollTop()
    document.location.hash = hash
    $window.scrollTop(scroll)

  scrollTo = (top, callback) ->
    $('html, body').animate(scrollTop: top, 400, callback)

  # Link emulation

  links = easings.find('.link')

  links.click ->
    hash($(@).attr('href'))
    if isMobile
      after 600, ->
        allScroll = $window.scrollTop()
        top = $('.easing-description:visible').offset().top + 10
        scrollTo(top) if allScroll > top
    false

  links.on 'touchstart', -> $(@).closest('.easing').addClass('pressed')
  links.on 'touchend touchmove', -> easings.removeClass('pressed')
  $(document).scroll -> easings.removeClass('pressed')

  # Easing example

  unless isMobile
    graphBottom = parseInt(easings.find('.example').css('top'))
    graphHeight = easings.height()
    dotX = easings.find('.dot').css('left')
    dotY = easings.find('.dot').css('top')

    easings.hoverIntent
      out: ->
        $(@).find('.example').stop().css(top: graphBottom).end().
             find('.dot').stop().css(top: dotY, left: dotX)
      over: ->
        easing = $(@).find('.easing-title').text()
        $(@).
          find('.example').animate(top: '-=60', 1000, easing).end().
          find('.dot').animate { top: '-=60', left: '+=119'}
            duration: 1000
            specialEasing: top: easing, left: 'linear'

  # Highlight easings part

  unless isMobile
    section = $('.easings')
    titles  = section.find('.part-title')
    titles.mouseenter -> section.addClass('hightlight-part')
    titles.mouseleave -> section.removeClass('hightlight-part')

  # Show easing description

  translations = $('footer a')
  hashToTranslations = (hash) ->
    translations.each ->
      url = $(@).attr('href').replace(/#.*$/, '')
      $(@).attr(href: url + hash)

  easingPages = $('.easing-description')
  slider      = $('.slide-slider')

  showSubpage = ->
    if location.hash == '#' or location.hash == ''
      $body.removeClass('easing-page')
      hashToTranslations('')
    else
      name = location.hash[1..-1]
      easingPages.hide()
      easingPages.filter(".#{name}").show()
      $body.addClass('easing-page')
      hashToTranslations("##{name}")

  showSubpage()
  $window.on('hashchange', showSubpage)

  after 1, -> $body.addClass('page-animation')

  # Back to all easings

  $('.easing-description .back').click ->
    href = $(@).attr('href')
    if isMobile and allScroll
      scrollTo allScroll, -> hash(href)
    else
      hash(href)
    false

  # Detect 3D support

  detect3d = ->
    support = $body.css('perspective')?
    if support and document.body.style.webkitPerspective?
      support = matchMedia("(transform-3d), (-webkit-transform-3d)").matches
    support

  support3d = detect3d()
  $body.addClass(if support3d then 'transform3d' else 'transform2d')

  # Open source badge text

  texts = $('.open-source .text .variant')
  selected = Math.floor((texts.length - 0.001) * Math.random())
  texts.removeClass('show').eq(selected).addClass('show')

  # Open source corner animation

  unless isMobile
    corner = $('.open-source').attr(target: '_blank')

    if support3d
      shadow    = corner.find('.shadow')
      translate = corner.find('.translate')
      rotator   = corner.find('.rotator')

      duration = rotator.css('transition-duration')
      duration = parseFloat(duration) * 1000

      shadowing = ->
        if shadow.is(':animated')
          shadow.stop(true).animate(opacity: 0, (duration / 2), 'easeOutQuart')
        else
          shadow.animate(opacity: 1, (duration / 2), 'easeInQuart').
                 animate(opacity: 0, (duration / 2), 'easeOutQuart')

      corner.mouseenter ->
        shadowing()
        after duration, ->
          translate.addClass('show') if corner.is(':hover')
      corner.mouseleave ->
        shadowing()
        translate.removeClass('show')

      # FF backface-visibility fix

      back = corner.find('.text, .border')
      corner.mouseenter ->
        back.stop(true).delay(duration / 2).hide(1)
      corner.mouseleave ->
        back.stop(true).delay(duration / 2).show(1)

  # Detect limit Internet on mobile

  if isMobile
    net = navigator.connection
    if net and net.type != net.CELL_2G and net.type != net.CELL_3G
      $body.removeClass('limit-internet')
