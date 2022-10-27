import Navbar from '../../components/Navbar'
import GroupbuySection from './GroupbuySection'
import TrendingSection from './TrendingSection' 
import GroupSection from './GroupSection' 

export default function Homepage() {

  return (
    <>
      <Navbar />
      <TrendingSection />
      <GroupbuySection />
      <GroupSection />
    </>
  )
}