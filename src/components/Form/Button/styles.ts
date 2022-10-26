import { TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled(TouchableOpacity)`
    width: 100%;
    background-color: ${({ theme }) => theme.colors.secondary};

    border-radius: 5px;
    
    align-items: center;
    
    // working around TouchableOpacity in Modal
    /* padding: 18px; */
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;

    color: ${({ theme }) => theme.colors.shape};

    // working around TouchableOpacity in Modal
    background-color: ${({ theme }) => theme.colors.success};
    padding: 18px;
    width: 100%;
    text-align: center;
`;
