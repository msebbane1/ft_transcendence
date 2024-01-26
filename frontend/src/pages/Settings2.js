import styles from '../styles/Settings.module.scss'
import TwoFAComponent from '../components/settings/TwoFactorFeature';

const SettingsFeature = (title: string, subtitle: string, children: JSX.Element) => {
	return <li className={styles.settings_feature}>
		<div className={styles.settings_feature_title}>
			<h2>{title}</h2>
			<p>{subtitle}</p>
		</div>
		<div className={styles.settings_feature_body}>{children}</div>
	</li>
}

export {SettingsFeature}

/*const Settings = () => {
	return <main className={styles.settings}>
		//<div className={styles.settings_header}>
			//<div className={styles.settings_header_container}>
			//	<h1>Settings</h1>
			//</div>
		//</div>
		<ul className={styles.settings_features}>
			<TwoFactorFeature />
		</ul>
	</main>
}*/
const Settings = () => {
  return (
    <main className={styles.settings}>
      <ul className={styles.settings_features}>
        <TwoFAComponent />
      </ul>
    </main>
  );
};

export default Settings;
