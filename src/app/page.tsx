import Image from 'next/image'
import styles from './page.module.css'
import { ReactHookForm } from './components/ReactHookForm'

export default function Home() {
  return (
    <main className={styles.main}>
<ReactHookForm></ReactHookForm>
    </main>
  )
}
