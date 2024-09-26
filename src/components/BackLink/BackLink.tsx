import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import styles from './backLink.module.scss';

const BackLink = ({ to }: { to: string }) => {
  return (
    <Link className={`${styles.backLink}`} href={to}>
      <FontAwesomeIcon icon={faArrowLeft} />
      Back
    </Link>
  );
};

export default BackLink;
