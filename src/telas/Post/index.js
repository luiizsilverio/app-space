import { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert } from "react-native";

import { salvarPost, atualizarPost, deletarPost } from "../../servicos/firestore";
import { deletarImagem, salvarImagem } from "../../servicos/storage";
import { alteraDados, pickImageFromGallery } from "../../utils/comum";
import { IconeClicavel } from "../../componentes/IconeClicavel";
import { MenuInferior } from "../../componentes/MenuInferior";
import imagemPadrao from '../../assets/upload.jpeg';
import { entradas } from "./entradas";
import estilos from "./estilos";

// const img = 'https://img.freepik.com/fotos-gratis/belos-planetas-no-espaco_23-2149288539.jpg?w=900&t=st=1680822204~exp=1680822804~hmac=86e063a9f20fbd6707801375739c53957a016533dbe17f5c840b17ec72f9a2e8';

export default function Post({ navigation, route }) {
  const { item } = route?.params || {};
  const [desabilitarEnvio, setDesabilitarEnvio] = useState(false);
  const [imagem, setImagem] = useState(item?.imagemUrl || null);
  const [showMenu, setShowMenu] = useState(false);

  const [post, setPost] = useState({
      titulo: item?.titulo || "",
      fonte: item?.fonte || "",
      descricao: item?.descricao || "",
      imagemUrl: item?.imagemUrl || null
  });

  async function pickImage() {
    pickImageFromGallery(setImagem);    
    setShowMenu(false);
  }

  async function salvar() {
    setDesabilitarEnvio(true);
    
    // salva o post no Firestore
    if (item) {
      await verificarAlteracaoPost();
      return navigation.goBack();      
    } 

    const idPost = await salvarPost({
      ...post, 
      imagemUrl: imagem ? '' : null
    });

    navigation.goBack();

    // faz upload da imagem
    if (imagem !== null) {
      atualizaImagem(idPost);
    }
  }

  async function atualizaImagem(idPost) {
    const url = await salvarImagem(imagem, idPost);
    await atualizarPost(idPost, { imagemUrl: url });
  }
  
  async function verificarAlteracaoPost() {
    if (post.imagemUrl !== imagem) {
      atualizaImagem(item.id);
    } else {
      await atualizarPost(item.id, post);
    }
  }

  function excluirPostCompleto() {

    async function confirmaExclusao() {
      deletarPost(item.id); 
      if (item.imagemUrl !== null) {
        deletarImagem(item.id);
      }
      navigation.goBack();
    }

    if (!item) return;
    if (!Alert.alert('Excluir Post', 'Confirma exclusão?', [
      {
        text: "Confirma", 
        style: 'cancel',  // mostra em vermelho, somente iOS
        onPress: () => confirmaExclusao()
      },
      { 
        text: "Cancela",
        // onPress: () => {}
      },
    ]));    
  }

  async function removerImagem() {
    if (!item) return;
    if (await deletarImagem(item.id)) {
      await atualizarPost(item.id, { imagemUrl: null });
      navigation.goBack();
    }
  }

  return (
    <View style={estilos.container}>
      <View style={estilos.containerTitulo}>
        <Text style={estilos.titulo}>{item ? "Editar post" : "Novo Post"}</Text>
        <IconeClicavel 
          exibir={!!item} 
          onPress={excluirPostCompleto}
          iconeNome="trash-2" 
        />
      </View>
      <ScrollView style={{ width: "100%" }}>
        {
          entradas?.map((entrada) => (
            <View key={entrada.id}>
              <Text style={estilos.texto}>{entrada.label}</Text>
              <TextInput
                value={post[entrada.name]}
                placeholder={entrada.label}
                multiline={entrada.multiline}
                onChangeText={(valor) => 
                    alteraDados(
                        entrada.name, 
                        valor, 
                        post, 
                        setPost
                    )
                }
                style={
                    [estilos.entrada, entrada.multiline && estilos.entradaDescricao]
                }
              />
            </View>
          ))
        }

        <TouchableOpacity style={estilos.imagem} onPress={() => setShowMenu(true)}>
          <Image
            source={imagem ? {uri: imagem} : imagemPadrao}
            style={estilos.imagem}
          />
        </TouchableOpacity>

      </ScrollView>

      <TouchableOpacity 
        style={estilos.botao} 
        onPress={salvar} 
        disabled={desabilitarEnvio}
      >
        <Text style={estilos.textoBotao}>Salvar</Text>
      </TouchableOpacity>

      <MenuInferior mostrarMenu={showMenu} setMostrarMenu={setShowMenu}>
        <TouchableOpacity style={estilos.opcao} onPress={pickImage}>
          <Text>&#128247;</Text>
          <Text> Adicionar foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.opcao} onPress={removerImagem}>
          <Text>&#128465;</Text>
          <Text> Remover foto</Text>
        </TouchableOpacity>
      </MenuInferior>
    </View>
  );
}