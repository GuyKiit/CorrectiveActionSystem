export async function setValueMas(dataMas: any, value: any, colname: any) {  
  const valueMas = await dataMas.filter((el: any) => el[`${colname}`] == value);
  if (Array.isArray(valueMas)) {
    return valueMas[0];
  }
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