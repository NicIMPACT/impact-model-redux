---
title: Argentina Summary
date: 5/26/2017
type: brief
briefType: country-summary
project: 'baseline'
locations:
  - lac-argentina
  - south_america
  - americas
scenarios:
 - ssp2_gfdl
 - ssp2_hgem
 - ssp2_miroc
 - ssp2_ipsl
 - ssp2_nocc
tags:
 - lac-argentina
 - south_america
 - americas
 - baseline
---
# Overview 

```chart
mark: bar
title: Argentina - Total Demand
width: 37%
encoding:
  x:
    type: nominal
    field: year
  y:
    type: quantitative
    field: Val
fixed:
  region: lac-argentina
  impactparameter: qdxagg
  year: 2015,2030,2050
dropdown:
  field: agg_commodity
  values: amt,aot,cer,r&t,pul,f&v,sgc,sgr,ols,oil,mls,cot,for
```

```chart
mark: bar
title: Argentina - Household Demand
width: 37%
encoding:
  x:
    type: nominal
    field: year
  y:
    type: quantitative
    field: Val
fixed:
  region: lac-argentina
  impactparameter: qfxagg
  year: 2015,2030,2050
dropdown:
  field: agg_commodity
  values: amt,aot,cer,r&t,pul,f&v,sgc,sgr,ols,oil,mls,cot,for
```



|   |   | 2015 | 2030 | 2050 |
|---|---|---|---|---|
| South America | Population (million) | 411.97 | 460.07 | 490.50 |
|  | GDP (billion $US) | 4813.50 | 8078.48 | 12989.35 |
|  | Per capita GDP ($US) | 11684.10 | 17559.24 | 26481.86 |
| Argentina | Population (million) | 42.05 | 46.16 | 49.38 |
|  | GDP (billion $US) | 719.04 | 1198.22 | 1911.36 |
|  | Per capita GDP ($US) | 17099.64| 25957.97| 38707.17|