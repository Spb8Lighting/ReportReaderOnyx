import Message from './../message'
/**
 *  Function to Hide/Show the previous or next sibling element
 *
 * @param {object} e Event
 * @param {string} Sibling previousSibling, nextSibling
 */
const HideShowSibling = (e, Sibling) => {
  e.preventDefault()
  let Father = e.target.closest('svg')
  let SiblingFather = Father[Sibling]
  if (SiblingFather == null || SiblingFather.nodeName !== 'svg') {
    Message({ ok: `<em>${Sibling === 'previousSibling' ? 'First' : 'Last'} Bank!</em>` })
  } else {
    Father.classList.add('hide')
    SiblingFather.classList.remove('hide')
  }
}
export default (PlaybackContent, ConsoleClass) => {
  let Console = PlaybackContent.querySelector(ConsoleClass)
  let ConsoleDivs = Console.querySelectorAll('div.LeftSide, div.RightSide')
  ConsoleDivs.forEach(ConsoleDiv => {
    let ConsoleSVG = ConsoleDiv.querySelectorAll('svg')
    let NumberofConsole = ConsoleSVG.length
    if (NumberofConsole > 1) {
      for (let i = 0; i < NumberofConsole; i++) {
        let CurrentConsole = ConsoleSVG[i]
        if (i > 0) {
          CurrentConsole.classList.add('hide')
        }
        let ButtonMinus = CurrentConsole.querySelector('.BankSelector .minus')
        let ButtonPlus = CurrentConsole.querySelector('.BankSelector .plus')

        if (ButtonMinus) {
          ButtonMinus.addEventListener('click', e => HideShowSibling(e, 'previousSibling'))
        }
        if (ButtonPlus) {
          ButtonPlus.addEventListener('click', e => HideShowSibling(e, 'nextSibling'))
        }
      }
    }
  })
}
