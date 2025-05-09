import { BplHeader } from "@/components/bpl/bpl-header";
import { BplFooter } from "@/components/bpl/bpl-footer";

export default function RulesPage() {
  return (
    <>
      <BplHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Brick & Bolt Premier League (BPL) - Operations Team - Rules
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">League Duration:</h2>
          <p className="text-lg">12th May to 30th June</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Objective:</h2>
          <p className="text-lg">
            Motivate the Operations team (SPMs, TLs, OMs) by gamification
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. League Structure & Teams
          </h2>
          <h3 className="text-xl font-semibold mb-2">Participants:</h3>
          <ul className="list-disc list-inside text-lg ml-4">
            <li>SPMs (Site Project Managers) – Compete individually</li>
            <li>TLs (Team Leads) – Compete individually (based on team performance)</li>
            <li>OMs (Operations Managers) – Compete individually (based on overall zone performance)</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2 mt-4">Team Formation:</h3>
          <ul className="list-disc list-inside text-lg ml-4">
            <li>SPMs will be grouped under their respective TLs.</li>
            <li>TLs will be grouped under their respective OMs.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. Scoring System (Runs Calculation)
          </h2>
          <h3 className="text-xl font-semibold mb-2">
            Project Status Changes (Runs Earned/Deducted)
          </h3>
          <table className="table-auto w-full text-lg mb-4">
            <thead>
              <tr>
                <th className="border px-4 py-2">Status Change</th>
                <th className="border px-4 py-2">Runs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Red → Amber</td>
                <td className="border px-4 py-2">+4</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Red → Green</td>
                <td className="border px-4 py-2">+6</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Amber → Green</td>
                <td className="border px-4 py-2">+2</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Green → Red</td>
                <td className="border px-4 py-2">-6</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Amber → Red</td>
                <td className="border px-4 py-2">-4</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Green → Amber</td>
                <td className="border px-4 py-2">-2</td>
              </tr>
            </tbody>
          </table>

          <h3 className="text-xl font-semibold mb-2">Additional Bonuses (Extra Runs)</h3>
          <h4 className="text-lg font-semibold mb-2">Attendance Bonus:</h4>
          <ul className="list-disc list-inside text-lg ml-4 mb-4">
            <li>95-100% attendance → +10 runs</li>
            <li>90-94% attendance → +5 runs</li>
            <li>Below 90% → Disqualified</li>
          </ul>
          <h4 className="text-lg font-semibold mb-2">Time Spent on Site:</h4>
          <ul className="list-disc list-inside text-lg ml-4 mb-4">
            <li>SPMs must spend ≥75 mins/site/day (average, duration of the league)</li>
            <li>Below 75 mins → Disqualified</li>
          </ul>
           <h4 className="text-lg font-semibold mb-2">Testimonials collection (Rating should be more than equal to 4)</h4>
          <ul className="list-disc list-inside text-lg ml-4 mb-4">
            <li>Video - Google view - 12 runs per review</li>
            <li>Review with Photos - 6 runs per review</li>
            <li>Review with text - 2 runs per review, Name to TL & CRN is a mandate.</li>
          </ul>
           <p className="text-lg mb-4">Google form needs to be filled post the review is done, its mandatory.</p>
           <p className="text-lg mb-4">Reviews collected between the BPL dates will be considered.</p>
           <p className="text-lg mb-4">We will verify the review & then give the runs.</p>

           <h4 className="text-lg font-semibold mb-2">Customer delight meetings</h4>
           <ul className="list-disc list-inside text-lg ml-4 mb-4">
             <li>Completion of meeting will earn 4 runs</li>
             <li>In addition to these runs → Completion of meeting & the immediate Next review improves by 4 points, will earn 8 runs</li>
             <li>Next review improves by 3 points, will earn 6 runs</li>
             <li>Next review improves by 2 points, will earn 4 runs</li>
             <li>Next review improves by 1 point, will earn 2 runs</li>
           </ul>
            <p className="text-lg mb-4">Google form needs to be filled post the meeting is done, its mandatory.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Disqualification Criteria
          </h2>
          <ul className="list-disc list-inside text-lg ml-4">
            <li>Project termination (excluding customer cases).</li>
            <li>Attendance &gt;95%.</li>
            <li>Average site time &gt;75 mins/day</li>
          </ul>
           <p className="text-lg mt-4">Please note: Attendance is calculated excluding the leaves (planned leaves & sick leaves)</p>
        </section>

         <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Brick & Bolt Premier League (BPL) - Prize Distribution
          </h2>
          <h3 className="text-xl font-semibold mb-2">Prizes:</h3>
          <p className="text-lg mb-4">*(for 11 SPMs + 4 TLs + 1VM + 1 Sourcing executive)*</p>
          <h4 className="text-lg font-semibold mb-2">Best City Celebration Fund:</h4>
          <p className="text-lg mb-4">₹50,000 (managed by city OM - To be used for celebration with BnB Ops city team)</p>
          <h4 className="text-lg font-semibold mb-2">Individual Prizes:</h4>
          {/* You can add details about individual prizes here if you have them */}
          <p className="text-lg">Details about individual prizes can be added here.</p> {/* Placeholder */}
        </section>

        <section className="mb-8">
           <h3 className="text-xl font-semibold mb-2">Runs calculation for VM:</h3>
           <p className="text-lg mb-4">VM - Maximum CP onboarding + CP allocation TAT + CP change TAT</p>

           <h3 className="text-xl font-semibold mb-2">Sourcing exec.:</h3>
            <p className="text-lg mb-4">Maximum CP onboardings from the leads supplied</p>
        </section>

        <section className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Add tiebreakers</h3>
             {/* You can add details about tiebreakers here if you have them */}
            <p className="text-lg">Details about tiebreakers can be added here.</p> {/* Placeholder */}
        </section>


        <section className="mb-8 text-center text-2xl font-bold">
          <p>🚀 Let the Games Begin! 🚀</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            MITC (Most important & Terms and Conditions)
          </h2>
          <ul className="list-disc list-inside text-lg ml-4">
            <li>
              The management reserves the right to modify or change the rules of the program at any point in time without prior notice, especially in cases where any form of gamification or manipulation is observed.
            </li>
            <li>
              Any individual found violating the principles of fair play may be removed from the league. Such decisions will require the approval of the Chief Operating Officer (COO) and will be evaluated on a case-by-case basis.
            </li>
            <li>
              Payouts related to the program will be disbursed along with the monthly payroll and will be processed in the July payroll cycle.
            </li>
          </ul>
        </section>
      </main>
      <BplFooter />
    </>
  );
}
