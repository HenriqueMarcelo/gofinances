import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
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
} from './styles';
import { categories } from '../../utils/categories';

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
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  const theme = useTheme();

  async function loadData() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response!) : [];

    const expensives = responseFormatted
      .filter((expensive: TransactionData) => expensive.type === 'negative');

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
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content>
        <MonthSelect>
          <MonthSelectButton>
            <MonthSelectIcon name="chevron-left" />
          </MonthSelectButton>
          <Month>Maio</Month>
          <MonthSelectButton>
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

    </Container>
  );
}
