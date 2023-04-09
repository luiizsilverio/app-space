import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export async function salvarImagem(urlImagem, nomeImagem) {
  if (!urlImagem) return;
  if (!nomeImagem) {
    nomeImagem = Date.now().toString();
  }

  const downloadImagem = await fetch(urlImagem);
  const blobImagem = await downloadImagem.blob();
  const imagemRef = ref(storage, `posts/${nomeImagem}.png`);

  try {
    await uploadBytes(imagemRef, blobImagem);    
    const dbUrl = await getDownloadURL(imagemRef);
    return dbUrl;
  }
  catch (erro) {
    console.log(erro);
    return null;
  }
}

export async function deletarImagem(postId) {
  const refStorage = ref(storage, `posts/${postId}.png`);
  try {
    await deleteObject(refStorage);
    return true;
  }
  catch (erro) {
    console.log(erro);
    return false;
  }
}