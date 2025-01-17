import React, { FC } from 'react'
import dayjs from 'dayjs'

import ChartHandler from 'components/to-be-cleaned/Charts/ChartHandler'
import { ChargeableProduct, PaygStats, ProductFeature } from './PAYGUsage.types'
import { deriveProductCost } from './PAYGUsage.utils'
import { chargeableProducts } from './PAYGUsage.constants'
import { DATE_FORMAT } from 'lib/constants'

interface Props {
  paygStats: PaygStats
  dateRange: {
    period_start: { date: string; time_period: string }
    period_end: { date: string; time_period: string }
    interval: string
  }
}

const PAYGUsage: FC<Props> = ({ paygStats, dateRange }) => {
  const startDate =
    dateRange.period_start.date ?? dayjs().utc().startOf('month').format(DATE_FORMAT)
  const endDate = dateRange.period_end.date ?? dayjs().utc().endOf('month').format(DATE_FORMAT)

  return (
    <div className="flex flex-col">
      {chargeableProducts.map((product: ChargeableProduct) => {
        const productCost = deriveProductCost(paygStats, product)

        return (
          <div
            key={product.title}
            className="border-panel-border-light dark:border-panel-border-dark mb-8 overflow-hidden rounded border"
          >
            <div className="bg-panel-body-light dark:bg-panel-body-dark w-full">
              <div className="bg-panel-header-light dark:bg-panel-header-dark">
                <div className="flex items-center justify-between overflow-hidden rounded px-6 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-white">
                      <img width={'16'} src={product.iconUrl} />
                    </div>
                    <h5 className="mb-0 font-medium">{product.title}</h5>
                  </div>
                  {product.title !== 'Authentication' && (
                    <div className="flex items-center space-x-1">
                      <p className="text-scale-1000">$</p>
                      <h4 className="text-lg m-0 font-medium">{productCost.toFixed(3)}</h4>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                {product.features.map((feature: ProductFeature) => (
                  <div
                    key={feature.title}
                    className="border-panel-border-light dark:border-panel-border-dark relative border-t px-6 py-3"
                  >
                    <ChartHandler
                      hideChartType
                      label={`${feature.title} for ${dayjs().format('MMMM')}`}
                      attribute={feature.attribute}
                      provider="daily-stats"
                      startDate={startDate}
                      endDate={endDate}
                      interval="1d"
                      highlight="maximum"
                      defaultChartStyle="bar"
                      customDateFormat={'MMM D, YYYY'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PAYGUsage
