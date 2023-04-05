import { View, ScrollView, Image } from "react-native";
import { useEffect, useState } from "react";
import { ref, getDownloadURL } from "firebase/storage";

import { Cabecalho } from "../../componentes/Cabecalho";
import { CartaoInfo } from "../../componentes/CartaoInfo";
import { NovoPostBotao } from "../../componentes/NovoPostBotao";
import { pegarPostsTempoReal } from "../../servicos/firestore";

import estilos from "./estilos";
import { storage } from "../../config/firebase";

export default function Principal({ navigation }) {
    const [posts, setPosts] = useState([]);
    const [urlImage, setUrlImage] = useState('');

    console.log(storage)
    useEffect(() => {
      const imagemRef = ref(storage, 'img4.png');
      getDownloadURL(imagemRef)
        .then((url) => setUrlImage(url));

      pegarPostsTempoReal(setPosts);
    },[])

    return (
        <View style={estilos.container}>
            <Cabecalho />

            {
              urlImage && (
                <Image
                  source={{ uri: urlImage }}
                  style={{ width: 180, height: 180 }}
                />
              )
            }

            <ScrollView style={estilos.scroll} showsVerticalScrollIndicator={false}>

                {posts?.map((item) => (
                    <CartaoInfo 
                        key={item.id} 
                        titulo={item.titulo}  
                        fonte={item.fonte} 
                        descricao={item.descricao} 
                        acao={() => navigation.navigate("Post", { item })}
                    />
                ))}
            </ScrollView>

            <NovoPostBotao acao={() => navigation.navigate("Post")} />
        </View>
    );
}
