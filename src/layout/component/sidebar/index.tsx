import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Tooltip, Collapse } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuth } from '../../../auth/core/AuthContext';
import { useLayout } from '../../core/LayoutProvider';
 
interface SidebarProps {
  isOpen: boolean;
}
 
interface MenuItem {
  menu_id?: number;
  menu_name: string;
  menu_icon?: string;
  menu_url?: string;
  menu_sequence?: number;
  menu_sub?: number;
  submenu: MenuItem[];
}
 
export default function Sidebar({ isOpen }: SidebarProps) {
  const { menuData, menuFuncData } = useAuth();
  const { setMenuFunc, setMenuFuncList } = useLayout();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
 
  // Auto-expand menus based on current location
  useEffect(() => {
    const currentPath = location.pathname.substring(1); // Remove leading slash
 
    // Find which menus should be expanded based on current path
    const shouldExpandMenus: { [key: string]: boolean } = {};
 
    const findAndExpandParentMenus = (items: MenuItem[], path: string) => {
      for (const item of items) {
        // Check if this item matches the current path
        if (item.menu_url === path) {
          return true;
        }
 
        // Check if any submenu matches
        if (item.submenu && item.submenu.length > 0) {
          const hasMatch = item.submenu.some(subItem =>
            subItem.menu_url === path || findAndExpandParentMenus(subItem.submenu, path)
          );
 
          if (hasMatch) {
            shouldExpandMenus[item.menu_name] = true;
            return true;
          }
        }
      }
      return false;
    };
 
    const menuResult = buildMenuWithSubmenu(menuData || []);
    findAndExpandParentMenus(menuResult, currentPath);
 
    setExpandedMenus(shouldExpandMenus);
  }, [location.pathname, menuData]);
 
  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };
 
  const handleClickTo = (item: MenuItem) => {
    if (item.menu_url) {
      setMenuFunction(item);
      navigate(`/${item.menu_url}`);
    }
  };
 
  // set menu function
  const setMenuFunction = (item: MenuItem) => {
    if (item.menu_url) {
      const menuFuncList = menuFuncData?.filter((func) => func?.menu_id === item.menu_id && func?.funct_oth === 'LIST');
      const menuFunc = menuFuncData?.filter((func) => func?.menu_id === item.menu_id && func?.funct_oth === '#');
      setMenuFuncList(menuFuncList);
      setMenuFunc(menuFunc);
      //console.log(menuFuncList, menuFunc, 'menuFuncList');
    }
  };
 
 
  function buildMenuWithSubmenu(data: any[]): MenuItem[] {
    const map = new Map<number, MenuItem>();
 
    // สร้าง Map แรกเพื่อเก็บ<|im_start|> scoutingหมด
    data.forEach(item => {
      map.set(item.menu_id, {
        ...item,
        submenu: []
      });
    });
 
    const tree: MenuItem[] = [];
 
    data.forEach(item => {
      const current = map.get(item.menu_id)!;
 
      if (item.menu_sub && map.has(item.menu_sub)) {
        const parent = map.get(item.menu_sub)!;
        parent.submenu.push(current);
      } else {
        tree.push(current); // menu_sub === 0 or undefined → เมนู scouting
      }
    });
 
    // เรียงลำ scouting submenu ด้วย menu_sequence (optional)
    const sortSubmenu = (items: MenuItem[]) => {
      items.sort((a, b) => (b.menu_sequence ?? 0) - (a.menu_sequence ?? 0));
      items.forEach(i => sortSubmenu(i.submenu));
    };
 
    sortSubmenu(tree);
    return tree;
  }
 
  const menuResult: MenuItem[] = buildMenuWithSubmenu(menuData || []);
 
  const isMenuActive = (item: MenuItem): boolean => {
    if (!item.menu_url) return false;
    return location.pathname === `/${item.menu_url}`;
  };
 
  const isMenuParentActive = (item: MenuItem): boolean => {
    return item.submenu?.some(sub =>
      location.pathname === `/${sub.menu_url}` || isMenuParentActive(sub)
    ) || false;
  };
 
  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus[item.menu_name] || false;
    const paddingLeft = level * 1.5 + 0.5;
    const isActive = isMenuActive(item);
    const isParentActive = isMenuParentActive(item);
 
    const renderLabel = () => {
      if (level === 0) {
        // Top-level menu: collapsing label
        return (
          <span
            className="relative overflow-hidden"
            style={{
              width: isOpen ? 'auto' : '0px',
              transition: 'width 0.3s',
            }}
          >
            <label
              className={`absolute left-0 top-0 whitespace-pre transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'
                }`}
            >
              {item.menu_name}
            </label>
          </span>
        );
      } else {
        // Submenu: always visible
        return <span className="whitespace-pre">{item.menu_name}</span>;
      }
    };
 
    const iconAndLabel = (
      <div className="w-full">
        {item.menu_icon && (
          <span className={`mr-3 min-w-[20px] text-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
            <i className={`${item.menu_icon} text-base`}></i>
          </span>
        )}
        <span className={`mr-3 min-w-[20px] text-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
            <i className={`text-base`}></i>
          </span>
        {renderLabel()}
      </div>
    );
 
    if (hasSubmenu) {
      return (
        <li key={item.menu_name}>
          <Tooltip title={!isOpen && level === 0 ? item.menu_name : ''} placement="right">
            <div
              onClick={() => toggleSubmenu(item.menu_name)}
              className={`flex items-center p-2 text-sm rounded-lg transition-all cursor-pointer`}
              style={{ paddingLeft: `${paddingLeft}rem` }}
            >
              {iconAndLabel}
              {isOpen && (
                <ChevronRightIcon
                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                />
              )}
            </div>
          </Tooltip>
          <Collapse in={isOpen && isExpanded}>
            <ul className="space-y-1 py-1">
              {item.submenu.map(subItem => renderMenuItem(subItem, level + 1))}
            </ul>
          </Collapse>
        </li>
      );
    }
 
    return (
      <li key={item.menu_name}>
        <Tooltip title={!isOpen && level === 0 ? item.menu_name : ''} placement="right">
          <div
            className={`flex items-center p-2 text-sm rounded-lg transition-all cursor-pointer
              ${isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-900 hover:bg-gray-100'}`}
            onClick={() => handleClickTo(item)}
            style={{ paddingLeft: `${paddingLeft}rem` }}
          >
            {iconAndLabel}
          </div>
        </Tooltip>
      </li>
    );
  };
 
  return (
    <aside
      // dark:bg-gray-800
      // dark:border-gray-700
      className={`fixed top-15 left-0 z-40 h-screen pt-20 transition-all bg-white border-r border-gray-200
    ${isOpen ? 'w-64' : 'w-16'}
    sm:translate-x-0
    overflow-x-hidden
  `}
    >
      <div className="h-full px-3 pt-5 pb-4 overflow-y-auto overflow-x-hidden bg-white">
        {/* dark:bg-gray-800 */}
        <ul className="space-y-2 font-medium">
          {menuResult.map(item => renderMenuItem(item))}
        </ul>
      </div>
    </aside>
  );
}