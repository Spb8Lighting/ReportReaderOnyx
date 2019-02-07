let AssignObject = (Obj1, Obj2) => {
  let MergeObject = {}
  let Id = 0
  let Object1Length = Object.keys(Obj1).length
  let Object2Length = Object.keys(Obj2).length
  if (Object1Length === 0 && Object2Length === 0) {
    return false
  }
  if (Object1Length > 0) {
    for (let i = 0; i < Object1Length; i++) {
      MergeObject[Id] = Obj1[i]
      Id++
    }
  }
  if (Object2Length > 0) {
    for (let i = 0; i < Object2Length; i++) {
      MergeObject[Id] = Obj2[i]
      Id++
    }
  }
  return MergeObject
}

export default AssignObject
