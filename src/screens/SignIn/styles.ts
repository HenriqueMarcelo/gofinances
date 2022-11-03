import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
`;

export const Header = styled.View`
    width: 100%;
    height: 70%;
    background-color: ${({ theme }) => theme.colors.primary};

    justify-content:flex-end;
    align-items: center;
`;

export const TitleWrapper = styled.View`
    align-items: center;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(27)}px;
    color: ${({ theme }) => theme.colors.shape};

    text-align: center;
    margin-top: ${RFValue(40)}px;
`;

export const SingInTitle = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(16)}px;
    color: ${({ theme }) => theme.colors.shape};

    text-align: center;
    margin-top: ${RFValue(43)}px;
    margin-bottom: ${RFValue(65)}px;
`;

export const Footer = styled.View`
    background-color: ${({ theme }) => theme.colors.secondary};
    width: 100%;
    height: 30%;
`;

export const FooterWrapper = styled.View`
    margin-top: ${RFPercentage(-4)}px;
    padding: 0 32px;
    justify-content: space-between;
`;
