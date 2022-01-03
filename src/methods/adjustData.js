// 當資料沒有中文版本時替換成英文
export default function () {
  let AdjustedData = null
  const combine = (objZh, objUs) => {
    // Array.from() 可以將類陣列物件或可迭代物件轉為陣列
    AdjustedData = Array.from(objZh)
    for (let i = 0; i < AdjustedData.length; i++) {
      if (AdjustedData[i].overview === '') {
        AdjustedData[i].overview = objUs[i].overview
      }
      if (AdjustedData[i].biography === '') {
        AdjustedData[i].biography = objUs[i].biography
      }
      AdjustedData[i].genres = objUs[i].genres
    }
    return AdjustedData
  }
  return { combine }
}
