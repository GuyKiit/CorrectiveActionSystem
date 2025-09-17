// export async function setValueMas(dataMas: any, value: any, colname: any) {  
//   const valueMas = await dataMas.filter((el: any) => el[`${colname}`] == value);
//   console.log(valueMas);
  
//   if (Array.isArray(valueMas)) {
//     return valueMas[0];
//   }
// }

export async function setValueMas(dataMas: any[], value: any, colname: any) {
  if (!Array.isArray(dataMas)) {
    console.warn("setValueMas: dataMas is not array", dataMas);
    return undefined;
  }

  // filter array ตามค่า
  const valueMas = dataMas.filter((el: any) => el[colname] == value);
  console.log("setValueMas result:", valueMas);

  // คืน object ตัวแรก (เหมือนเดิม)
  return valueMas[0];
}


export async function setValueMasMulit(dataMas: any, value: string, colname: string) {
  const values = value.split(',');
  const valueMas = await dataMas.filter((el: any) => {
    if (el[colname]) {
      const partyTypes = el[colname].split(','); 
      return values.some(val => partyTypes.includes(val));
    }
    return false;
  });
  if (Array.isArray(valueMas)) {
    return valueMas;
  }
  return null;
}