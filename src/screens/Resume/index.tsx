import React, { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HistoryCard } from '../../components/HistoryCard';
import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer,
} from './styles';
import { categories } from '../../utils/categories';
import { useAuth } from '../../hooks/auth';

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  key: string;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsloading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  const theme = useTheme();

  const { user } = useAuth();

  function handleDateChange(action: 'next' | 'prev') {
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    setIsloading(true);
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response!) : [];

    const expensives = responseFormatted
      .filter((expensive: TransactionData) => expensive.type === 'negative'
        && new Date(expensive.date).getMonth() === selectedDate.getMonth()
        && new Date(expensive.date).getFullYear() === selectedDate.getFullYear());

    const expensivesTotal = expensives
      .reduce((
        acumullator: number,
        expensive: TransactionData,
      ) => acumullator + Number(expensive.amount), 0);

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;
      expensives.forEach((expensive: TransactionData) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });
      if (categorySum > 0) {
        const percent = `${((categorySum / expensivesTotal) * 100).toFixed(0)}%`;

        const total = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        totalByCategory.push({
          name: category.name,
          color: category.color,
          key: category.key,
          total: categorySum,
          totalFormatted: total,
          percent,
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsloading(false);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]));

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

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
            <Content>
              <MonthSelect>
                <MonthSelectButton onPress={() => handleDateChange('prev')}>
                  <MonthSelectIcon name="chevron-left" />
                </MonthSelectButton>
                <Month>{ format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>
                <MonthSelectButton onPress={() => handleDateChange('next')}>
                  <MonthSelectIcon name="chevron-right" />
                </MonthSelectButton>
              </MonthSelect>

              <ChartContainer>
                <VictoryPie
                  data={totalByCategories}
                  x="percent"
                  y="total"
                  colorScale={totalByCategories.map((category) => category.color)}
                  style={{
                    labels: {
                      fontSize: RFValue(18),
                      fontWeight: 'bold',
                      fill: theme.colors.shape,
                    },
                  }}
                  labelRadius={80}
                />
              </ChartContainer>
              {
        totalByCategories.map((item) => (
          <HistoryCard
            title={item.name}
            amount={item.totalFormatted}
            color={item.color}
            key={item.key}
          />
        ))
        }
            </Content>
          )
      }
    </Container>
  );
}
