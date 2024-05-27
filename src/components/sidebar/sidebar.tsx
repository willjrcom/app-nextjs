import React from 'react';
import { IconType } from 'react-icons';
import { FaUserTie, FaCog, FaPlus } from 'react-icons/fa';
import { TiFlowMerge } from 'react-icons/ti';
import { MdFastfood, MdOutlineHomeWork } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";
import Link from 'next/link';
import styles from './sidebar.module.css';

interface TopbarItemProps {
  icon: IconType;
  label: string;
  path: string;
}

interface TopbarItemCompanyProps {
  icon: IconType;
  label: string;
}

const SidebarItem: React.FC<TopbarItemProps> = ({ icon: Icon, label, path }) => {
  return (
    <Link href={path}>
      <div className={styles.menuItem}>
        <Icon className={styles.icon} />
        <span className={styles.label}>{label}</span>
      </div>
    </Link>
  )
}

const SidebarItemCompany: React.FC<TopbarItemCompanyProps> = ({ icon: Icon, label }) => {
  return (
    <div className={styles.menuItemCompany}>
      <Icon className={styles.icon} />
      <div className='grid'>
        <span className={styles.label}>{label}</span>
        <div className={styles.description}>
          <span>Rua Piedade 226, Jd. Leocadia</span>
          <span>(11) 96384-9111</span>
        </div>
      </div>
    </div>
  )
}

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarContainer}>
        <SidebarItemCompany icon={MdOutlineHomeWork} label="Loja" />
        <SidebarItem icon={FaPlus} label="Novo Pedido" path="/" />
        <SidebarItem icon={TiFlowMerge} label="Processos" path="/" />
        <SidebarItem icon={MdFastfood} label="Cardápio" path="/pages/product" />
        <SidebarItem icon={BsFillPeopleFill} label="Clientes" path="/pages/client" />
        <SidebarItem icon={FaUserTie} label="Funcionários" path="/pages/employee" />
        <SidebarItem icon={MdOutlineHomeWork} label="Minha Empresa" path="/" />
        <SidebarItem icon={FaCog} label="Configurações" path="/" />
      </div>
    </div>
  );
};

export default Sidebar;
