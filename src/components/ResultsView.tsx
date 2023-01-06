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
    <div className="mx-auto w-[900px]">
      <h1 className="mb-4 text-2xl font-bold">Results</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left font-bold">
            <th className="border-b border-gray-300 bg-gray-200 py-4 px-6">
              Username
            </th>
            <th className="border-b border-gray-300 bg-gray-200 py-4 px-6">
              WPM
            </th>
            <th className="border-b border-gray-300 bg-gray-200 py-4 px-6">
              Accuracy
            </th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => {
            return (
              <tr key={stat.username} className="text-left">
                <td className="border-b border-gray-300 py-4 px-6">
                  {stat.username}
                </td>
                <td className="border-b border-gray-300 py-4 px-6">
                  {stat.stats.wpm}
                </td>
                <td className="border-b border-gray-300 py-4 px-6">
                  {stat.stats.accuracy}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
