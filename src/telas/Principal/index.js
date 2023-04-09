import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";

import { Cabecalho } from "../../componentes/Cabecalho";
import { CartaoInfo } from "../../componentes/CartaoInfo";
import { NovoPostBotao } from "../../componentes/NovoPostBotao";
import { pegarPostsTempoReal } from "../../servicos/firestore";
import { logout } from "../../servicos/auth";
import estilos from "./estilos";

export default function Principal({ navigation }) {
    const [posts, setPosts] = useState([]);
    const [notifications, setNotifications] = useState([]);

  function mostrarNotificacoes(){
    navigation.navigate("Notificacoes", { notificacoes: notifications });
    setNotifications([]);
  }

  useEffect(() => {
    pegarPostsTempoReal(setPosts);
  },[])

  return (
    <View style={estilos.container}>
      <Cabecalho 
        quantidadeNotificacoes={notifications.length}
        onPress={mostrarNotificacoes}
        logout={() => {
          logout();
          navigation.replace("Login");
        }}
      />

      <ScrollView style={estilos.scroll} showsVerticalScrollIndicator={false}>

        {posts?.map((item) => (
          <CartaoInfo 
              key={item.id} 
              titulo={item.titulo}  
              fonte={item.fonte} 
              descricao={item.descricao} 
              imagem={item?.imagemUrl}
              acao={() => navigation.navigate("Post", { item })}
          />
        ))}
      </ScrollView>

      <NovoPostBotao acao={() => navigation.navigate("Post")} />
    </View>
  );
}
