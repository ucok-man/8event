type Props = {
    children: React.ReactNode
}

export default function DashboardLayout({children}: Props) {
  return (
    <div>
      [SIDEBAR]
      {children}
    </div>
  )
}