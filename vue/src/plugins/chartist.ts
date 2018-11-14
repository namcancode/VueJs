import Chartist, { ChartistStatic, IChartistBase } from 'chartist'

export function ctPointLabels(options: any = {}) {
    return function ctPointLabels(chart: IChartistBase<any>) {
      var defaultOptions = {
        labelClass: 'ct-label',
        labelOffset: {
          x: 0,
          y: -10
        },
        textAnchor: 'middle'
      };
  
      options = Chartist.extend({}, defaultOptions, options);
  
      if(chart instanceof Chartist.Line) {
        chart.on('draw', function(data: any) {
          if(data.type === 'point') {
            data.group.elem('text', {
              x: data.x + options.labelOffset.x,
              y: data.y + options.labelOffset.y,
              style: 'text-anchor: ' + options.textAnchor
            }, options.labelClass).text(data.value.y);
          }
        });
      }
    }
  }