import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
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

export function SignIn() {
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
          Faça seu login com
          {'\n'}
          uma das contas abaixo
        </SingInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton title="Entrar com o Google" svg={GoogleSvg} />
          <SignInSocialButton title="Entrar com Apple" svg={AppleSvg} />
        </FooterWrapper>
      </Footer>
    </Container>
  );
}
