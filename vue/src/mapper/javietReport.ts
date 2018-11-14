import { JavietDoc, JAVIET_STEP } from '@/interface/Javiet'
import { groupBy, mapValues, map, assign, Dictionary, slice, sum, filter } from 'lodash'

export function getOverviewChartData(rawData: JavietDoc[]) {
  const intitDataByStep = mapValues(JAVIET_STEP, it => []) as Dictionary<JavietDoc[]>

  const groupByStep = assign(intitDataByStep, groupBy(rawData, 'engageStatus'))

  const countByStep = map(groupByStep, listDoc => listDoc.length)

  const funnelData = map(countByStep, (count, step) => sum(slice(countByStep, step - countByStep.length)))

  return {
    labels: JAVIET_STEP,
    series: [funnelData]
  }
}

export function getChartDataByRec(rawData: JavietDoc[], rec: string) {
  return getOverviewChartData(filter(rawData, it => it.recruiter === rec))
}
