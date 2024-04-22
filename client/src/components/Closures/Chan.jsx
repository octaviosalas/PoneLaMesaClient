import React from "react"
import NavBarComponent from "../Navbar/Navbar"
import { Card, Metric, Text } from '@tremor/react';
import { DonutChart } from '@tremor/react';
import { LineChart } from '@tremor/react';
import { BarChart } from '@tremor/react';
import { AreaChart } from '@tremor/react';
import ClousureOfTheMonth from "./ClousureOfTheMonth";

const Chan = () => {


    const chartdata = [
            {
              date: 'Jan 22',
              SemiAnalysis: 2890,
              'The Pragmatic Engineer': 2338,
            },
            {
              date: 'Feb 22',
              SemiAnalysis: 2756,
              'The Pragmatic Engineer': 2103,
            },
            {
              date: 'Mar 22',
              SemiAnalysis: 3322,
              'The Pragmatic Engineer': 2194,
            },
            {
              date: 'Apr 22',
              SemiAnalysis: 3470,
              'The Pragmatic Engineer': 2108,
            },
            {
              date: 'May 22',
              SemiAnalysis: 3475,
              'The Pragmatic Engineer': 1812,
            },
            {
              date: 'Jun 22',
              SemiAnalysis: 3129,
              'The Pragmatic Engineer': 1726,
            },
            {
              date: 'Jul 22',
              SemiAnalysis: 3490,
              'The Pragmatic Engineer': 1982,
            },
            {
              date: 'Aug 22',
              SemiAnalysis: 2903,
              'The Pragmatic Engineer': 2012,
            },
            {
              date: 'Sep 22',
              SemiAnalysis: 2643,
              'The Pragmatic Engineer': 2342,
            },
            {
              date: 'Oct 22',
              SemiAnalysis: 2837,
              'The Pragmatic Engineer': 2473,
            },
            {
              date: 'Nov 22',
              SemiAnalysis: 2954,
              'The Pragmatic Engineer': 3848,
            },
            {
              date: 'Dec 22',
              SemiAnalysis: 3239,
              'The Pragmatic Engineer': 3736,
            },
    ];
          
    const dataFormatterr = (number) => `$${Intl.NumberFormat('us').format(number).toString()}`;

    const chartdataa = [
        {
          name: 'Amphibians',
          'Number of threatened species': 2488,
        },
        {
          name: 'Birds',
          'Number of threatened species': 1445,
        },
        {
          name: 'Crustaceans',
          'Number of threatened species': 743,
        },
        {
          name: 'Ferns',
          'Number of threatened species': 281,
        },
        {
          name: 'Arachnids',
          'Number of threatened species': 251,
        },
        {
          name: 'Corals',
          'Number of threatened species': 232,
        },
        {
          name: 'Algae',
          'Number of threatened species': 98,
        },
      ];
      
     const dataFormatte = (number) =>
     Intl.NumberFormat('us').format(number).toString();

     const chaartdata = [
        {
          date: 'Jan 22',
          SemiAnalysis: 2890,
          'The Pragmatic Engineer': 2338,
        },
        {
          date: 'Feb 22',
          SemiAnalysis: 2756,
          'The Pragmatic Engineer': 2103,
        },
        {
          date: 'Mar 22',
          SemiAnalysis: 3322,
          'The Pragmatic Engineer': 2194,
        },
        {
          date: 'Apr 22',
          SemiAnalysis: 3470,
          'The Pragmatic Engineer': 2108,
        },
        {
          date: 'May 22',
          SemiAnalysis: 3475,
          'The Pragmatic Engineer': 1812,
        },
        {
          date: 'Jun 22',
          SemiAnalysis: 3129,
          'The Pragmatic Engineer': 1726,
        },
        {
          date: 'Jul 22',
          SemiAnalysis: 3490,
          'The Pragmatic Engineer': 1982,
        },
        {
          date: 'Aug 22',
          SemiAnalysis: 2903,
          'The Pragmatic Engineer': 2012,
        },
        {
          date: 'Sep 22',
          SemiAnalysis: 2643,
          'The Pragmatic Engineer': 2342,
        },
        {
          date: 'Oct 22',
          SemiAnalysis: 2837,
          'The Pragmatic Engineer': 2473,
        },
        {
          date: 'Nov 22',
          SemiAnalysis: 2954,
          'The Pragmatic Engineer': 3848,
        },
        {
          date: 'Dec 22',
          SemiAnalysis: 3239,
          'The Pragmatic Engineer': 3736,
        },
      ];
      
      const dataFormatterrr = (number) =>
        `$${Intl.NumberFormat('us').format(number).toString()}`;
          

   
  return (
    <div>
        <NavBarComponent/>
           

         <div className="flex gap-6 items-center"> 
               
 
               <BarChart
                    data={chartdataa}
                    index="name"
                    categories={['Number of threatened species']}
                    colors={['blue']}
                    valueFormatter={dataFormatte}
                    yAxisWidth={48}
                    onValueChange={(v) => console.log(v)}
               />
        </div>

        <AreaChart
            className="h-80"
            data={chaartdata}
            index="date"
            categories={['SemiAnalysis', 'The Pragmatic Engineer']}
            colors={['indigo', 'rose']}
            valueFormatter={dataFormatterrr}
            yAxisWidth={60}
            onValueChange={(v) => console.log(v)}
        />


        <ClousureOfTheMonth/>


    </div>
  )
}

export default Chan
