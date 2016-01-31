#= require jquery.easing
#= require evil-front/after
#= require evil-front/detect-3d

evil.doc.ready ($) ->
  easings      = $('.easings li')
  descriptions = $('.easing-description')

  # Scroll

  allScroll = null

  hash = (hash) ->
    scroll = evil.win.scrollTop()
    document.location.hash = hash
    evil.win.scrollTop(scroll)

  scrollTo = (top, fn) -> $('html, body').animate(scrollTop: top, 600, fn)

  # Don’t scroll on hash change

  $('a[href^="#"]').click ->
    hash($(@).attr('href'))
    false

  # Block :active on title click

  easings.find('.easing-title').mousedown ->
    $(@).closest('.easing').removeClass('is-clickable')
  easings.find('.easing-title').mouseup ->
    $(@).closest('.easing').addClass('is-clickable')

  # Easing example

  easings.on 'touchstart', -> $(@).addClass('is-tapped')
  easings.mouseenter ->
    div = $(@)

    return if div.hasClass('is-tapped')
    easings.removeClass('is-tapped')

    easing = div.find('.easing-title').text()
    div.find('.example').stop().css(marginTop: 0).delay(400).
      animate(marginTop: -60, 1000, easing)
    div.find('.dot').stop().css(marginTop: 0, marginLeft: 0).delay(400).
      animate { marginTop: -60, marginLeft: 119 },
        duration: 1000
        specialEasing: marginTop: easing, marginLeft: 'linear'

  # Highlight easings part

  section = $('.easings')
  titles  = section.find('.part-title')
  titles.mouseenter -> section.addClass('hightlight-part')
  titles.mouseleave -> section.removeClass('hightlight-part')

  # Easing example in easing page

  cleanExample = (page) ->
    return if page.hasClass('exampled')
    page.find('.example').stop().css(marginTop: 0)
    page.find('.dot').stop().css(marginTop: 0, marginLeft: 0)

  showExample = (page) ->
    return if page.hasClass('exampled')
    easing = page.find('h2').text()

    page.addClass('exampled')
    after 400, ->
      page.find('.example').animate(marginTop: -78, 1000, easing)
      page.find('.dot').animate { marginTop: -78, marginLeft: 154 },
        duration: 1000
        specialEasing: marginTop: easing, marginLeft: 'linear'
        complete: ->
          after 400, -> page.removeClass('exampled')

  descriptions.on 'open',  -> showExample($(@))
  descriptions.on 'close', -> cleanExample($(@))

  descriptions.find('.graph').on 'mouseenter click', ->
    page = $(@).closest('.easing-description')
    cleanExample(page)
    showExample(page)

  # Show easing description

  easingPages  = $('.easing-description')
  slider       = $('.slide-slider')
  lastPage     = null
  pageAnimated = false

  showSubpage = ->
    if location.hash == '#' or location.hash == ''
      return unless pageAnimated

      evil.body.removeClass('easing-page')
      after 600, ->
        lastPage?.trigger('close')
        scrollTo(allScroll) if allScroll
    else
      name = location.hash[1..-1]
      easingPages.hide()
      lastPage = easingPages.filter(".#{name}").show()
      evil.body.addClass('easing-page')

      if pageAnimated
        allScroll = evil.win.scrollTop()
        pageTop   = lastPage.offset().top + 10
        after 600, ->
          if allScroll > pageTop
            scrollTo pageTop, -> lastPage.trigger('open')
          else
            lastPage.trigger('open')
      else
        after 800, -> lastPage.trigger('open')

  showSubpage()
  evil.win.on('hashchange', showSubpage)

  after 1, ->
    pageAnimated = true
    evil.body.addClass('page-animation')

  evil.win.on 'keyup', (e) ->
    location.hash = '' if e.keyCode == 27 # Esc

  # Open source badge text

  corner   = $('.open-source')
  mainLang = (code) -> code.replace(/-[^-]+$/, '')

  pageLang   = mainLang($('html').attr('lang'))
  systemLang = mainLang(navigator.language || navigator.userLanguage)
  corner.addClass('user-can-translate') if pageLang != systemLang

  # Open source corner animation

  cornerActivated = false
  cornerAnimation = ->
    return if evil.win.width() < 600

    cornerActivated = true
    evil.win.off('resize.corner')

    if evil.body.hasClass('transform-3d')
      shadow   = corner.find('.shadow')
      rotator  = corner.find('.rotator')
      duration = rotator.css('transition-duration')
      duration = parseFloat(duration) * 1000

      shadowing = ->
        if shadow.is(':animated')
          shadow.stop(true).animate(opacity: 0, (duration / 2), 'easeOutQuart')
        else
          shadow.animate(opacity: 1, (duration / 2), 'easeInQuart').
                 animate(opacity: 0, (duration / 2), 'easeOutQuart')

      showCorner = ->
        corner.addClass('show')
        shadowing()
      hideCorner = ->
        corner.removeClass('show tappable')
        shadowing()
    else
      showCorner = -> corner.addClass('show')
      hideCorner = -> corner.removeClass('show tappable')

    corner.mouseenter(showCorner)
    corner.mouseleave(hideCorner)

    corner.find('.crop').on 'touchend', ->
      if corner.hasClass('show')
        hideCorner()
      else
        showCorner()
        corner.addClass('tappable')
      false

  cornerAnimation()
  evil.win.on('resize.corner', cornerAnimation) unless cornerActivated

  # Enable GitHub star button

  star = $('.star')
  if evil.body.width() > 430
    evil.win.load ->
      star.html( star.text() ).addClass('is-enable')
      star.find('iframe').on 'load', -> star.addClass('is-show')
      after 5000, -> star.addClass('is-show')

  # Change languages link to select

  changer = $('<select />').insertAfter('footer ul').change ->
    location.href = $(@).val() + location.hash

  $('footer li').each ->
    lang   = $(@).find('a, span')
    href   = lang.attr('href') || location.pathname
    option = $('<option />').attr(value: href).text(lang.text())
    option.attr(selected: true) if lang.is('span')
    option.appendTo(changer)
  $('footer ul').hide()
