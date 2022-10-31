/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import {
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';

import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../../components/Form/Button';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import { CategorySelect } from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from './styles';

interface FormData {
  [name: string]: string;
}

const schema = Yup.object().shape({
  name: Yup
    .string()
    .required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo'),
});

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const dataKey = '@gofinances:transactions';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  async function handleRegister(form: FormData) {
    if (!transactionType) {
      return Alert.alert('Selecione o tipo da transação');
    }

    if (category.key === 'category') {
      return Alert.alert('Selecione a categoria');
    }

    const newTranslation = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
    };

    try {
      const dataStorage = await AsyncStorage.getItem(dataKey);
      const currentData = dataStorage ? JSON.parse(dataStorage!) : [];

      const dataFormatter = [
        ...currentData,
        newTranslation,
      ];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatter));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      Alert.alert('Não foi possível salvar');
    }
  }

  useEffect(() => {
    async function loadData() {
      const data = await AsyncStorage.getItem(dataKey);
      // eslint-disable-next-line no-console
      console.log(JSON.parse(data!)); // confia
    }

    loadData();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionTypes>
              <TransactionTypeButton
                isActive={transactionType === 'up'}
                type="up"
                title="Income"
                onPress={() => handleTransactionTypeSelect('up')}
              />
              <TransactionTypeButton
                isActive={transactionType === 'down'}
                type="down"
                title="Outcome"
                onPress={() => handleTransactionTypeSelect('down')}
              />
            </TransactionTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>
          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
