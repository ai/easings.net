#= require jquery.chrono
#= require jquery.easing
#= require jquery.hoverIntent

after = jQueryChrono.after
every = jQueryChrono.every

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

  easings.click ->
    if $(@).hasClass('highlight')
      location.hash = ''
    else
      location.hash = $(@).find('.link').attr('href')
    false

  easings.mouseenter -> $(@).addClass('hover')
  easings.mouseleave -> $(@).removeClass('hover')

  # Allow to copy easing name quicky by double click

  dblclickWaiting = null
  dbclickHash     = location.hash
  headers = easings.find('h2')

  headers.click ->
    dblclickWaiting = true
    dbclickHash     = location.hash
    easing = $(@).closest('li')
    after '200ms', ->
      if dblclickWaiting
        easing.click()
        dblclickWaiting = false
    false

  headers.dblclick ->
    if dblclickWaiting
      location.hash   = dbclickHash
      dblclickWaiting = null

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

  highlight = ->
    easing = easings.find(".link[href=#{location.hash}]").closest('li')
    if easing.length
      $('.easings').addClass('highlighted')
      easings.removeClass('highlight')
      easing.addClass('highlight')
    else
      $('.easings').removeClass('highlighted')
      easings.removeClass('highlight')

  highlight()
  $(window).on('hashchange', highlight)
