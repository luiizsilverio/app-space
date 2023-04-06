import { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";

import { salvarPost, atualizarPost, deletarPost } from "../../servicos/firestore";
import { salvarImagem } from "../../servicos/storage";
import { entradas } from "./entradas";
import { alteraDados } from "../../utils/comum";
import { IconeClicavel } from "../../componentes/IconeClicavel";
import estilos from "./estilos";

const img = 'https://img.freepik.com/fotos-gratis/belos-planetas-no-espaco_23-2149288539.jpg?w=900&t=st=1680822204~exp=1680822804~hmac=86e063a9f20fbd6707801375739c53957a016533dbe17f5c840b17ec72f9a2e8';

export default function Post({ navigation, route }) {
    const [desabilitarEnvio, setDesabilitarEnvio] = useState(false);
    const { item } = route?.params || {};

    const [post, setPost] = useState({
        titulo: item?.titulo || "",
        fonte: item?.fonte || "",
        descricao: item?.descricao || "",
        imagemUrl: item?.imagemUrl || null
    });

    async function salvar() {
        setDesabilitarEnvio(true);

        // faz upload da imagem
        const url = await salvarImagem(img);

        // salva o post no Firestore
        if (item) {
            await atualizarPost(item.id, post);
        } else {
            await salvarPost({
              ...post, 
              imagemUrl: url
            });
        }        
        
        navigation.goBack();
    }

    return (
        <View style={estilos.container}>
            <View style={estilos.containerTitulo}>
                <Text style={estilos.titulo}>{item ? "Editar post" : "Novo Post"}</Text>
                <IconeClicavel 
                    exibir={!!item} 
                    onPress={() => {deletarPost(item.id); navigation.goBack()}}
                    iconeNome="trash-2" 
                />
            </View>
            <ScrollView style={{ width: "100%" }}>
                {entradas?.map((entrada) => (
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
                ))}
            </ScrollView>

            <TouchableOpacity 
              style={estilos.botao} 
              onPress={salvar} 
              disabled={desabilitarEnvio}
            >
              <Text style={estilos.textoBotao}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
}