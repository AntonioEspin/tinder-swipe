document.addEventListener('mousedown', startDrag)
document.addEventListener('touchstart', startDrag, {passive: true})

const DECISION_THRESHOLD = 175
let isAnimating = false
let pullDeltaX = 0

function startDrag (event) {
  if (isAnimating) return

  // Obtener el primer articulo del elemento
  const actualCard = event.target.closest('article')

  if(!actualCard) return

  const startX = event.pageX ?? event.touches[0].pageX

  // escuchar los movimientos del mouse y el touche
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onEnd)

  document.addEventListener('touchmove', onMove, {passive: true})
  document.addEventListener('touchend', onEnd, {passive: true})

  function onMove (event) {
    const currentX = event.pageX ?? event.touches[0].pageX

    pullDeltaX = currentX - startX

    if (pullDeltaX === 0) return

    isAnimating = true

    const deg = pullDeltaX / 15

    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`

    actualCard.style.cursor = 'grabbing'

    // cambiar la opacidad 
    const opacity = Math.abs(pullDeltaX) / 100
    const isRight = pullDeltaX > 0

    const choiceElement = isRight
      ? actualCard.querySelector('.choice.like')
      : actualCard.querySelector('.choice.nope')

    choiceElement.style.opacity = opacity
  }

  function onEnd (event) {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onEnd)

    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onMove)

    const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

    if(decisionMade) {
      const goRight = pullDeltaX >= 0
      const goLeft = !goRight

      // añadir clase acorde a la decision
      actualCard.classList.add(goRight ? 'go-right': 'go-left')
      actualCard.addEventListener('transitionend', ()=>{
        actualCard.remove()
      }, {once: true})
    } else {
      actualCard.classList.add('reset')
      actualCard.classList.remove('go-right', 'go-left')
    }

    actualCard.addEventListener('transitionend', ()=> {
      actualCard.removeAttribute('style')
      actualCard.classList.remove('reset')
      actualCard.querySelectorAll('.choice').forEach(el => {
        el.style.opacity = 0
      })

      pullDeltaX = 0
      isAnimating = false
    })
  }
}