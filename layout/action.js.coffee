#= require jquery.easing
#= require jquery.hoverIntent

jQuery ($) ->

  # Language autodetection

  if location.pathname == '/'
    langs = $('footer li a')
    codes = langs.map -> $(@).attr('lang')
    if $.inArray(navigator.language, codes) > -1
      link = langs.filter("[lang=#{navigator.language}]")
      location.pathname = link.attr('href')

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

  # Highlight easing

  howtos = $('.howtos')
  howtos.find('.easing').each -> $(@).data(text: $(@).text())

  highlight = ->
    easing = easings.find(".link[href=#{location.hash}]").closest('li')
    if easing.length
      $('.easings').addClass('highlighted')
      easings.removeClass('highlight')
      easing.addClass('highlight')
      howtos.find('.click').slideUp()
      howtos.find('.js   .easing').text(easing.data('jquery'))
      howtos.find('.sass .easing').text(easing.data('sass'))
      howtos.find('.css  .easing').text(easing.data('css'))
      if easing.data('css')
        howtos.find('.no-css-support').slideUp(400)
        howtos.find('.css pre, .sass pre').slideDown(400)
      else
        howtos.find('.no-css-support').slideDown(400)
        howtos.find('.css pre, .sass pre').slideUp(400)
    else
      $('.easings').removeClass('highlighted')
      easings.removeClass('highlight')
      howtos.find('.click').slideDown()
      howtos.find('.easing').each -> $(@).text($(@).data('text'))
      howtos.find('.no-css-support').slideUp(400)
      howtos.find('.css pre, .sass pre').slideDown(400)

  highlight()
  $(window).on('hashchange', highlight)

  # Detect 3D support

  detect3d = ->
    return true  if document.body.style.MozPerspective?

    return false unless window.matchMedia?
    result = matchMedia("all and (transform-3d)")
    return true if result.matches

    prefix = 'moz'    if $.browser.mozilla
    prefix = 'webkit' if $.browser.webkit
    prefix = 'o'      if $.browser.opera
    prefix = 'ms'     if $.browser.msie
    matchMedia("all and (-#{prefix}-transform-3d)").matches

  support3d = detect3d()
  $('body').addClass(if support3d then 'transform3d' else 'transform2d')

  # Open source corner animation

  if support3d
    corner = $('.open-source')
    shadow = corner.find('.shadow')

    shadowing = ->
      if shadow.is(':animated')
        shadow.stop(true).animate(opacity: 0, 300, 'easeOutQuart')
      else
        shadow.animate(opacity: 1, 300, 'easeInQuart').
               animate(opacity: 0, 300, 'easeOutQuart')

    corner.mouseenter ->
      corner.addClass('hover').removeClass('unhover')
      shadowing()
    corner.mouseleave ->
      corner.removeClass('hover').addClass('unhover')
      shadowing()

    # FF backface-visibility fix

    if $.browser.mozilla
      back = corner.find('.text, .border')
      corner.mouseenter ->
        back.stop().delay(300).hide(1)
      corner.mouseleave ->
        back.stop().delay(300).show(1)
