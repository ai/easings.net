#= require jquery.easing
#= require jquery.hoverIntent

after = (ms, fn) -> setTimeout(fn, ms)

jQuery ($) ->
  easings = $('.easings li')
  $body   = $('body')

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
      easing = $(@).find('.easing-title').text()
      $(@).
        find('.example').animate(top: '-=60', 1000, easing).end().
        find('.dot').animate { top: '-=60', left: '+=119'}
          duration: 1000
          specialEasing: top: easing, left: 'linear'

  # Highlight easings part

  section = $('.easings')
  titles  = section.find('.part-title')
  titles.mouseenter -> section.addClass('hightlight-part')
  titles.mouseleave -> section.removeClass('hightlight-part')

  # Show easing description

  easingPages = $('.easing-description')
  slider      = $('.slide-slider')

  showSubpage = ->
    if location.hash == '#' or location.hash == ''
      $body.removeClass('easing-page')
    else
      name = location.hash[1..-1]
      easingPages.hide()
      easingPages.filter(".#{name}").show()
      $body.addClass('easing-page')

  showSubpage()
  $(window).on('hashchange', showSubpage)

  after 1, -> $body.addClass('page-animation')

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

  if support3d
    corner    = $('.open-source')
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
