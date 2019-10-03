import React from 'react';
import { Camera } from 'expo-camera';
import { AsyncStorage } from 'react-native';
import * as Permissions from 'expo-permissions';
import moment from 'moment';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ScrollView,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  StatusBar
} from 'react-native';


const profile = {
  "picture": "https://secure.gravatar.com/avatar/f50a9db56e231198af3507f10b5d5491?d=mm",
  "email": "rafael.fuzifaru@gmail.com",
  "first_name": "Rafael",
  "last_name": "Fuzifaru Cianci",
  "phone": "(48) 99110-3535",
  "gender": 1,
  "birthday": "1993-04-27T00:00:00-03:00",
  "linkedin": "https://www.linkedin.com/in/rafaelcianci",
  "github": "http://github.com/rafacianci",
  "address": {
    "Street": "",
    "ZipCode": "",
    "Number": "",
    "ComplementaryAddress": ""
  },
  "language": ["Português - PT", "Inglês - EN", "Japonês - JA"],
  "name": "Rafael Fuzifaru Cianci"
}

export default class Profile extends React.PureComponent {
  fadeAnimation = new Animated.Value(0)

  state = {
    loading: true,
    cameraOpen: false,
    hasCameraPermission: null,
    imagePerfil: profile.picture
  }

  constructor(props) {
    super(props)
    this.renderCamera = this.renderCamera.bind(this)
    this.cameraShot = this.cameraShot.bind(this)
    this.carregarImagem = this.carregarImagem.bind(this)
  }
  async componentDidMount() {
    this.finishLoading()
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    this.carregarImagem()
  }
  async carregarImagem(){
    const imagePerfil =  await AsyncStorage.getItem('imagemPerfil')
    console.warn(imagePerfil)
    if(imagePerfil){
      this.setState({imagePerfil: imagePerfil})
    }
  }

  finishLoading = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      Animated.timing(this.fadeAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }).start()

      this.setState({ loading: false })
    } catch (error) {
      console.error(error)
    }
  }
  async cameraShot() {
    if (this.cameraRef) {
      let photo = await this.cameraRef.takePictureAsync({ quality: 0.1, base64: true });
      console.warn(photo.base64.toString().substr(1,10))
      await AsyncStorage.setItem('imagemPerfil',`data:image/jpg;base64,${photo.base64}`.toString())
      this.carregarImagem()
      this.setState({ cameraOpen: false })
      this.finishLoading();
    }
  }
  renderCamera() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <Camera
          active={true}
          style={{ flex: 1 }}
          ref={(ref) => this.cameraRef = ref}
          className={'expo-camera'}
        >
          <StatusBar className={'status-bar'} hidden={this.state.cameraOpen} />
          <View style={{ flex: 1, alingItems: 'center', justifyContent: 'flex-end', backgroundColor: 'transparent' }}>
            <Button
              title="tirar foto"
              className={'camera-shot'}
              onPress={() => this.cameraShot()}
            />
            <Button
              className={'camera-close'}
              title="fechar camera"
              onPress={() => {this.setState({ cameraOpen: false }); this.finishLoading()}}
            />
          </View>
        </Camera>

      )
    }
  }

  render() {
    if (this.state.cameraOpen)
      return this.renderCamera()
    else
      return (
        <View style={styles.container}>
          <StatusBar className={'status-bar'} hidden={this.state.cameraOpen} />
          <View style={styles.header}>
            <Image
              className="header-image"
              style={styles.headerImage}
              source={{ uri: 'https://forum.codenation.com.br/uploads/default/original/2X/2/2d2d2a9469f0171e7df2c4ee97f70c555e431e76.png' }}
            />
          </View>
          {this.state.loading && (
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color="#7800ff" />
            </View>
          )}
          {!this.state.loading && (
            <ScrollView>

              <View style={styles.profileTitle}>
                <TouchableOpacity className={'profile-image-btn'} onPress={() => this.setState({ cameraOpen: true })}>
                  <Image
                    className="profile-image"
                    style={styles.profileImage}
                    source={{ uri: this.state.imagePerfil }}
                  />
                </TouchableOpacity>
                <Text className="profile-name" style={styles.profileName}>{profile.name}</Text>
              </View>
              <Animated.View className="contact-content" style={[styles.userContent, { opacity: this.fadeAnimation }]}>
                <Text className="contact-label" style={styles.contentLabel}>Linkedin:</Text>
                <Text className="contact-value" style={{ ...styles.contentText, ...styles.mBottom }}>{profile.linkedin}</Text>

                <Text className="contact-label" style={styles.contentLabel}>Github:</Text>
                <Text className="contact-value" style={styles.contentText}>{profile.github}</Text>
              </Animated.View>
              <Animated.View className="contact-content" style={[styles.userContent, { opacity: this.fadeAnimation }]}>
                <Text className="contact-label" style={styles.contentLabel}>E-mail:</Text>
                <Text className="contact-value" style={{ ...styles.contentText, ...styles.mBottom }}>{profile.email}</Text>

                <Text className="contact-label" style={styles.contentLabel}>Celular:</Text>
                <Text className="contact-value" style={{ ...styles.contentText, ...styles.mBottom }}>{profile.phone}</Text>

                <Text className="contact-label" style={styles.contentLabel}>Data de Nascimento:</Text>
                <Text className="contact-value" style={{ ...styles.contentText, ...styles.mBottom }}>
                  {moment(profile.birthday).format('DD/MM/YYYY')}
                </Text>

                <Text className="contact-label" style={styles.contentLabel}>Sexo:</Text>
                <Text className="contact-value" style={{ ...styles.contentText, ...styles.mBottom }}>
                  {profile.gender === 1 ? 'Masculino' : 'Feminino'}
                </Text>

                <Text className="contact-label" style={styles.contentLabel}>Idiomas:</Text>
                <View style={styles.languageContent}>
                  {profile.language.map(language => (
                    <View key={language} style={styles.language}>
                      <Text className="contact-language" style={styles.languageText}>
                        {language}
                      </Text>
                    </View>
                  ))}
                </View>
              </Animated.View>
            </ScrollView>
          )}
        </View>
      );
  }
}

const styles = StyleSheet.create({
  loadingContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: '#7800ff',
    borderBottomWidth: 2,
    padding: 16,
    paddingTop: 55
  },
  headerImage: {
    height: 45,
    width: 250
  },
  title: {
    color: '#7800ff',
    fontSize: 30,
    padding: 16,
  },
  profileTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16
  },
  profileImage: {
    borderRadius: 22,
    height: 45,
    width: 45
  },
  profileName: {
    color: '#7800ff',
    fontSize: 20,
    paddingLeft: 16
  },
  userContent: {
    backgroundColor: '#000',
    borderRadius: 2,
    margin: 16,
    padding: 16,
    marginTop: 0
  },
  contentLabel: {
    color: '#FFFFFF',
    fontSize: 11
  },
  contentText: {
    color: '#FFFFFF',
    fontSize: 14
  },
  mBottom: {
    marginBottom: 16
  },
  languageContent: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  language: {
    backgroundColor: '#666',
    borderRadius: 50,
    marginRight: 16,
    marginTop: 8
  },
  languageText: {
    color: '#FFFFFF',
    fontSize: 14,
    padding: 5,
    paddingHorizontal: 10
  }
});
