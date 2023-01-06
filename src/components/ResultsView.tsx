import React from "react";

type Stats = {
  username: string;
  stats: {
    wpm: number;
    accuracy: number;
  };
}[];

type Props = {
  stats: Stats;
};

export default function ResultsView(props: Props) {
  const { stats } = props;

  console.log({ stats });
  return (
    <div>
      <h1>Results</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>WPM</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => {
            return (
              <tr key={stat.username}>
                <td>{stat.username}</td>
                <td>{stat.stats.wpm}</td>
                <td>{stat.stats.accuracy}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
