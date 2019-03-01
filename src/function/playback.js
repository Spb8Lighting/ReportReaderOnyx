import { Console } from './physical'
import { SetLoaded as DisplaySetLoaded } from './../display'
import ConsolePaging from './consolepaging'

const CuelistClick = (element, DisplayCuelist = false) => {
  let QuerySelector = typeof element.hash !== 'undefined' ? element.hash : element.href.baseVal
  let Target = document.querySelector(QuerySelector)

  let CuelistArticle = document.getElementById('Cuelist')
  let PlaybackArticle = document.getElementById('Playback')
  if (Target) {
    // Open Pop-in
    element.addEventListener('click', (e) => {
      e.preventDefault()
      Target.classList.remove('hideButPrint')
      if (DisplayCuelist) {
        CuelistArticle.classList.add('fade')
        PlaybackArticle.classList.remove('fade')
      }
      // Manage history
      window.history.pushState(null, document.title, e.target.hash)
    })
    // Close button
    Target.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault()
      e.target.parentNode.parentNode.classList.add('hideButPrint')
      if (DisplayCuelist) {
        CuelistArticle.classList.remove('fade')
        PlaybackArticle.classList.add('fade')
      }
      // Manage history
      window.history.pushState(null, document.title, window.location.origin)
    })
  } else {
    console.error('Console cuelist listener can\'t be added [Element, Target]', element)
  }
}

export default async (CurrentTable) => {
  let PlaybackContent = document.getElementById('Playback')
  let divOverflow = document.createElement('div')
  divOverflow.className = 'overflow'
  divOverflow.appendChild(await Console.M1())
  divOverflow.appendChild(await Console.MTouch())
  divOverflow.appendChild(await Console.MPlay())
  PlaybackContent.appendChild(divOverflow)
  DisplaySetLoaded('Playback', false)
  CurrentTable.querySelectorAll('a').forEach(element => CuelistClick(element))
  PlaybackContent.querySelectorAll('a').forEach(element => CuelistClick(element, true))
  ConsolePaging(PlaybackContent, '.M-Touch')
  ConsolePaging(PlaybackContent, '.M-Play')
  ConsolePaging(PlaybackContent, '.M1HD')
}