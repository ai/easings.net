#= require jquery.easing

after   = (ms, fn) -> setTimeout(fn, ms)
isAgent = (regexp) -> !!navigator.userAgent.match(regexp)

jQuery ($) ->
  easings      = $('.easings li')
  descriptions = $('.easing-description')
  $body        = $('body')
  $window      = $(window)
  isMobile     = window.innerWidth < 600
  isTablet     = isAgent(/iPad/) or isAgent(/Android/)
  isDesktop    = not isMobile and not isTablet

  $body.addClass('tablet') if isTablet

  # Scroll

  allScroll = null

  hash = (hash) ->
    scroll = $window.scrollTop()
    document.location.hash = hash
    $window.scrollTop(scroll)

  scrollTo = (top, fn) -> $('html, body').animate(scrollTop: top, 600, fn)

  # Don’t scroll on hash change

  $('a[href^=#]').click ->
    hash($(@).attr('href'))
    false

  # Link emulation

  links = easings.find('.link')

  links.on 'mousedown touchstart', ->
    $(@).closest('.easing').addClass('pressed')
  links.on 'touchend touchmove', ->
    easings.removeClass('pressed')
  $body.mouseup ->
    easings.removeClass('pressed')
  $(document).scroll ->
    easings.removeClass('pressed')

  # Easing example

  if isDesktop
    easings.mouseenter ->
      div    = $(@)
      easing = div.find('.easing-title').text()
      div.find('.example').stop().css(marginTop: 0).delay(400).
        animate(marginTop: -60, 1000, easing)
      div.find('.dot').stop().css(marginTop: 0, marginLeft: 0).delay(400).
        animate { marginTop: -60, marginLeft: 119 },
          duration: 1000
          specialEasing: marginTop: easing, marginLeft: 'linear'

  # Highlight easings part

  if isDesktop
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
      page.find('.dot').animate { marginTop: -78, marginLeft: 154}
        duration: 1000
        specialEasing: marginTop: easing, marginLeft: 'linear'
        complete: ->
          after 400, -> page.removeClass('exampled')

  descriptions.on 'open',  -> showExample($(@))
  descriptions.on 'close', -> cleanExample($(@))

  descriptions.find('.graph').click ->
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

      $body.removeClass('easing-page')
      after 600, ->
        lastPage?.trigger('close')
        scrollTo(allScroll) if allScroll
    else
      name = location.hash[1..-1]
      easingPages.hide()
      lastPage = easingPages.filter(".#{name}").show()
      $body.addClass('easing-page')

      if pageAnimated
        allScroll = $window.scrollTop()
        pageTop   = lastPage.offset().top + 10
        after 600, ->
          if allScroll > pageTop
            scrollTo pageTop, -> lastPage.trigger('open')
          else
            lastPage.trigger('open')
      else
        after 800, -> lastPage.trigger('open')

  showSubpage()
  $window.on('hashchange', showSubpage)

  after 1, ->
    pageAnimated = true
    $body.addClass('page-animation')

  # Detect 3D support

  detect3d = ->
    support = $body.css('perspective')?
    if support and document.body.style.webkitPerspective?
      support = matchMedia("(transform-3d), (-webkit-transform-3d)").matches
    support

  support3d = detect3d()
  $body.addClass(if support3d then 'transform3d' else 'transform2d')

  # Open source badge text

  corner = $('.open-source')

  mainLang = (code) -> code.replace(/-[^-]+$/, '')

  pageLang   = mainLang($('html').attr('lang'))
  systemLang = mainLang(navigator.language || navigator.userLanguage)
  corner.addClass('user-can-translate') if pageLang != systemLang

  # Open source corner animation

  unless isMobile
    if support3d
      shadow    = corner.find('.shadow')
      rotator   = corner.find('.rotator')

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
        corner.removeClass('show')
        shadowing()
    else
      showCorner = -> corner.addClass('show')
      hideCorner = -> corner.removeClass('show')

    corner.mouseenter(showCorner)
    corner.mouseleave(hideCorner)

    corner.find('.crop').on 'touchend', ->
      if corner.hasClass('show')
        hideCorner()
      else
        showCorner()
      false

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
