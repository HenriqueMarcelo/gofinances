import { TouchableOpacity } from 'react-native';
import styled, { css } from 'styled-components/native';

import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

interface IconProps {
  type: 'up' | 'down';
}

interface ContainerProps {
  isActive: boolean;
  type: 'up' | 'down';
}

export const Container = styled(TouchableOpacity)<ContainerProps>`
    width: 48%;
    flex-direction: row;
    align-items: center;

    border-radius: 5px;
    border: 1.5px solid ${({ theme }) => theme.colors.text};
    border-width: ${({ isActive }) => (isActive ? 0 : 1.5)}px;

    padding: 16px;
    justify-content: center;


    ${({ isActive, type }) => type === 'up' && isActive && css`
        background-color: ${({ theme }) => theme.colors.success_light}
    `}

    ${({ isActive, type }) => type === 'down' && isActive && css`
        background-color: ${({ theme }) => theme.colors.attention_light}
    `}
`;

export const Icon = styled(Feather)<IconProps>`
    font-size: ${RFValue(24)}px;
    margin-right: 12px;

    color: ${({ theme, type }) => ((type === 'up') ? theme.colors.success : theme.colors.attention)}
`;

export const Title = styled.Text`
    font-size: ${RFValue(14)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
`;
