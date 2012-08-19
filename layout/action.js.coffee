#= require jquery.easing
#= require jquery.hoverIntent

after = (ms, fn) -> setTimeout(fn, ms)

jQuery ($) ->
  easings = $('.easings li')

  # Link emulation

  hash = (hash) ->
    scroll = $(window).scrollTop()
    document.location.hash = hash
    $(window).scrollTop(scroll)

  easings.find('.link').click ->
    if $(@).closest('li').hasClass('highlight')
      hash('')
    else
      hash($(@).attr('href'))
    false

  easings.mouseenter -> $(@).addClass('hover')
  easings.mouseleave -> $(@).removeClass('hover')

  # Easing example

  graphBottom = parseInt(easings.find('.example').css('top'))
  graphHeight = easings.height()
  dotX = easings.find('.dot').css('left')
  dotY = easings.find('.dot').css('top')

  easings.hoverIntent
    out: ->
      $(@).find('.example').stop().css(top: graphBottom).end().
           find('.dot').stop().css(top: dotY, left: dotX)
    over: ->
      easing = $(@).find('h2').text()
      $(@).
        find('.example').animate(top: '-=60', 1000, easing).end().
        find('.dot').animate { top: '-=60', left: '+=119'}
          duration: 1000
          specialEasing: top: easing, left: 'linear'

  # Show easing description

  easingPages = $('.easing-description')
  slider      = $('.slide-slider')

  showSubpage = ->
    if location.hash == '#' or location.hash == ''
      slider.removeClass('easing')
    else
      name = location.hash[1..-1]
      easingPages.hide()
      easingPages.filter(".#{name}").show()
      slider.addClass('easing')

  showSubpage()
  $(window).on('hashchange', showSubpage)

  after 1, -> slider.addClass('animated')

  # Detect 3D support

  prefix = 'moz'    if $.browser.mozilla
  prefix = 'webkit' if $.browser.webkit
  prefix = 'o'      if $.browser.opera
  prefix = 'ms'     if $.browser.msie

  detect3d = ->
    return true  if document.body.style.MozPerspective?
    return false unless window.matchMedia?

    result = matchMedia("all and (transform-3d)")
    return true if result.matches
    matchMedia("all and (-#{prefix}-transform-3d)").matches

  support3d = detect3d()
  $('body').addClass(if support3d then 'transform3d' else 'transform2d')

  # Open source corner animation

  if support3d
    corner    = $('.open-source')
    shadow    = corner.find('.shadow')
    translate = corner.find('.translate')
    rotator   = corner.find('.rotator')

    duration   = rotator.css('transition-duration')
    duration ||= rotator.css("-#{prefix}-transition-duration")
    duration   = parseFloat(duration) * 1000

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
