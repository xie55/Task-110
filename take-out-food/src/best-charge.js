const loadAllItems = require('./items');
const loadPromotions = require('./promotions')
//分割inputs里面的字符串，得到商品信息
function getCartItem(inputs){
  let obj={},cartItem=[]
  for(let i of inputs){
    let splitArr=i.split(' x ')
    if(!obj[splitArr[0]]){
      obj[splitArr[0]]=splitArr[1]
    }
  }
  for(let i in obj){
    cartItem.push({id:i,count:obj[i]})
  }
  return cartItem
}
//获取用户购买的商品及其总价格
function getCartList(cartItem,loadAllItems){
  let list=[],cartList=[]
  for(let i of cartItem){
    for(let j of loadAllItems){
      if(i.id==j.id){
        if(!list[i.id]){
          list[i.id]={}
          list[i.id].id=i.id
          list[i.id].name=j.name
          list[i.id].count=i.count
          list[i.id].unitPrice=j.price
          list[i.id].price=i.count*j.price 
        }
      }
    }
  }
  for(let i in list){
    cartList.push(list[i])
  }
  return cartList
}
//满30减6
function promotion1(cartList){
  let summary=0,lastList=[]
  for(let i of cartList){
    summary+=i.price
  }
  if(summary>30){
    summary-=6
    lastList.push({summary:summary,savedMoney:6,way:'满30减6元，省6元'})
  }else{
    lastList.push({summary:summary})
  }
  return lastList
}
//指定菜品半价
function promotion2(cartList,loadPromotions){
  let summary=0,saved=0,lastList2=[],way='指定菜品半价('
  for(let i of cartList){
    for(let j of loadPromotions[1].items){
      if(i.id==j){
        saved+=i.price/2
        way+=(i.name+', ')
      }
    }
    summary+=i.price
  }
  way=way.substring(0,way.length-2)
  way+=')，省'+saved+'元'
  lastList2.push({summary:summary-saved,savedMoney:saved,way:way})
  return lastList2
}
//比较两种优惠哪个更划算
function chooseProms(lastList1,lastList2){
  let lastList
  let summary1=lastList1[0].summary
  let summary2=lastList2[0].summary
  if(summary1<summary2){
    lastList=lastList1
  }else{
    lastList=lastList2
  }
  return lastList
}
function print(cartList,lastList){
  let result='============= 订餐明细 =============\n'
  for(let i of cartList){
    result+=(i.name+' x '+i.count+' = '+i.price+'元\n')
  }
  for(let i of lastList){
    if(i.savedMoney>0){
      result+='-----------------------------------\n使用优惠:\n'+i.way+'\n'+
      '-----------------------------------\n'
    }else{
      result+='-----------------------------------\n'
    }
  }
  result+='总计：'+lastList[0].summary+'元\n==================================='
  return result
}
function bestCharge(inputs){
  let cartItem=getCartItem(inputs)
  let cartList=getCartList(cartItem,loadAllItems)
  let lastList1=promotion1(cartList)
  let lastList2=promotion2(cartList,loadPromotions)
  let lastList=chooseProms(lastList1,lastList2)
  let bestCharge=print(cartList,lastList)
  return bestCharge
}
module.exports=bestCharge;


