#= require jquery.chrono
#= require jquery.easing

after = jQueryChrono.after
every = jQueryChrono.every

jQuery ($) ->
  easings = $('.easings li')

  # Link emulation

  easings.click -> location.hash = $(@).find('a').attr('href')
  easings.mouseenter -> $(@).addClass('hover')
  easings.mouseleave -> $(@).removeClass('hover')
  easings.mousedown  -> $(@).addClass('pressed')
  easings.mouseup    -> $(@).removeClass('pressed')

  # Allow to copy easing name quicky by double click

  dblclickWaiting = false
  headers = easings.find('h2')

  headers.click ->
    dblclickWaiting = true
    easing = $(@).closest('li')
    after '200ms', ->
      if dblclickWaiting
        easing.click()
        dblclickWaiting = false
    false

  headers.dblclick ->
    dblclickWaiting = false
    location.hash = ''
