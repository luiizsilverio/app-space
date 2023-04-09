import * as ImagePicker from 'expo-image-picker';

// funcao para adicionar um novo item na lista
export const alteraDados = (variavel, valor, dados, setDados) => {
  setDados({
    ...dados,
    [variavel]: valor
  })
}

// funcao para verificar se a entrada esta vazia
export function verificaSeTemEntradaVazia(dados, setDados) {
  for (const [variavel, valor] of Object.entries(dados)) {
    if (valor == '') {
      setDados({
        ...dados,
        [variavel]: null
      })
      return true
    }
  }
  return false
}

export async function pickImageFromGallery(setImage) {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,  /* de 0 a 1 */
  });

  if (!result.cancelled) {
    setImage(result.uri);
    // setImage(result.assets[0].uri); // versão >= 48 do Expo
  }
}