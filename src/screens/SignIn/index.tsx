/* eslint-disable consistent-return */
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SingInTitle,
  Footer,
  FooterWrapper,
} from './styles';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const { signInWithGoogle, signInWithApple } = useAuth();
  const theme = useTheme();

  async function handleSignInWithGoogle() {
    setIsLoading(true);
    try {
      return await signInWithGoogle();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      Alert.alert('Não foi possível conectar a conta Google');
      setIsLoading(false);
    }
  }

  async function handleSignInWithApple() {
    setIsLoading(true);
    try {
      return await signInWithApple();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      Alert.alert('Não foi possível conectar a conta Apple');
      setIsLoading(false);
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />

          <Title>
            Controle suas
            {'\n'}
            finanças de forma
            {'\n'}
            muito simples
            {'\n'}
          </Title>
        </TitleWrapper>

        <SingInTitle>
          Faça login com
          {'\n'}
          { Platform.OS === 'ios' ? 'uma das contas ' : 'uma conta '}
          abaixo
        </SingInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com o Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          { Platform.OS === 'ios' && (
            <SignInSocialButton
              title="Entrar com Apple"
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            />
          ) }
        </FooterWrapper>

        { isLoading
        && (
        <ActivityIndicator
          color={theme.colors.shape}
          size="large"
          style={{ marginTop: 18 }}
        />
        )}
      </Footer>
    </Container>
  );
}
