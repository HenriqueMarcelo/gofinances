/* eslint-disable prefer-spread */
/* eslint-disable import/no-cycle */
import React, { useCallback, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LoadContainer,
} from './styles';
import { useAuth } from '../../hooks/auth';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlighProps {
  amount: string;
  lastTransaction: string;
}
interface HighlighData {
  entries: HighlighProps;
  expensives: HighlighProps;
  total: HighlighProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlighData, setHighlightData] = useState({} as HighlighData);

  const { signOut, user } = useAuth();

  const theme = useTheme();

  function getLastTransactionsDate(
    collection: DataListProps[],
    type: 'positive' | 'negative',
  ) {
    const collectionFilttered = collection
      .filter((transaction) => transaction.type === type);

    if (collectionFilttered.length === 0) {
      return 0;
    }

    const lastTransaction = new Date(Math.max.apply(
      Math,
      collectionFilttered
        .map((transaction) => new Date(transaction.date).getTime()),
    ));

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {
      month: 'long',
    })}`;
  }

  async function loadTransactions() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactionsDB = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensivesTotal = 0;

    const transactionsFormatted: DataListProps[] = transactionsDB
      .map((item: DataListProps) => {
        if (item.type === 'positive') {
          entriesTotal += Number(item.amount);
        } else {
          expensivesTotal += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date));

        return {
          ...item,
          amount,
          date,
        };
      });

    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionsDate(transactionsDB, 'positive');
    const lastTransactionExpensives = getLastTransactionsDate(transactionsDB, 'negative');

    const totalInterval = lastTransactionExpensives === 0
      ? 'N??o h?? transa????es'
      : `01 a ${lastTransactionExpensives}`;

    const total = entriesTotal - expensivesTotal;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: lastTransactionEntries
          ? `??ltima entrada dia ${lastTransactionEntries}`
          : 'N??o h?? transa????es',
      },
      expensives: {
        amount: expensivesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: lastTransactionExpensives
          ? `??ltima sa??da dia ${lastTransactionExpensives}`
          : 'N??o h?? transa????es',
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval,
      },
    });

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  return (
    <Container>
      {
        isLoading ? (
          <LoadContainer>
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
            />
          </LoadContainer>
        )
          : (
            <>
              <Header>
                <UserWrapper>
                  <UserInfo>
                    <Photo source={{ uri: user.photo }} />
                    <User>
                      <UserGreeting>Ol??,</UserGreeting>
                      <UserName>{user.name}</UserName>
                    </User>
                  </UserInfo>
                  <LogoutButton onPress={signOut}>
                    <Icon name="power" />
                  </LogoutButton>
                </UserWrapper>
              </Header>

              <HighlightCards>
                <HighlightCard
                  type="up"
                  title="Entradas"
                  amount={highlighData?.entries?.amount}
                  lastTransaction={highlighData?.entries?.lastTransaction}
                />
                <HighlightCard
                  type="down"
                  title="Sa??das"
                  amount={highlighData?.expensives?.amount}
                  lastTransaction={highlighData?.entries?.lastTransaction}
                />
                <HighlightCard
                  type="total"
                  title="Total"
                  amount={highlighData?.total?.amount}
                  lastTransaction={highlighData?.total?.lastTransaction}
                />
              </HighlightCards>

              <Transactions>
                <Title>Listagem</Title>
                <TransactionList
                  data={transactions}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <TransactionCard data={item} />}
                />

              </Transactions>
            </>
          )
      }
    </Container>
  );
}
