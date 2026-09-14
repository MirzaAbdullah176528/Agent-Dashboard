"use client"

import { useMemo, useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  LayoutDashboard,
  PlusIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type BadgeTone = "success" | "warning" | "destructive" | "outline"

type Project = {
  id: string
  name: string
  owner: string
  ownerInitials: string
  environment: string
  requests: number
  latencyMs: number
  status: "healthy" | "degraded" | "failed" | "pending"
}

const projects: Project[] = [
  {
    id: "prj_1",
    name: "acme-storefront",
    owner: "Ada Lovelace",
    ownerInitials: "AL",
    environment: "production",
    requests: 128_400,
    latencyMs: 84,
    status: "healthy",
  },
  {
    id: "prj_2",
    name: "billing-engine",
    owner: "Grace Hopper",
    ownerInitials: "GH",
    environment: "production",
    requests: 76_950,
    latencyMs: 142,
    status: "degraded",
  },
  {
    id: "prj_3",
    name: "recommendations-api",
    owner: "Alan Turing",
    ownerInitials: "AT",
    environment: "staging",
    requests: 41_280,
    latencyMs: 96,
    status: "healthy",
  },
  {
    id: "prj_4",
    name: "cron-aggregator",
    owner: "Katherine Johnson",
    ownerInitials: "KJ",
    environment: "staging",
    requests: 12_700,
    latencyMs: 311,
    status: "failed",
  },
  {
    id: "prj_5",
    name: "webhooks-gateway",
    owner: "Linus Torvalds",
    ownerInitials: "LT",
    environment: "development",
    requests: 8_540,
    latencyMs: 58,
    status: "pending",
  },
]

const statusBadgeVariant: Record<Project["status"], BadgeTone> = {
  healthy: "success",
  degraded: "warning",
  failed: "destructive",
  pending: "outline",
}

const statusLabels: Record<Project["status"], string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  failed: "Failed",
  pending: "Pending",
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value)



const stats = [
  { label: "Total requests", value: 267_870 },
  { label: "Avg latency", value: 138 },
  { label: "Active projects", value: 24 },
  { label: "Succeeded today", value: 19_412 },
]

const trends = ["+12.4%", "-8.2ms", "+3.1%", "+9.8%"]
const trendDirections = ["up", "down", "up", "up"] as const

type SortKey = "name" | "requests" | "latencyMs" | "status"

function SortButton({
  label,
  columnKey,
  currentKey,
  direction,
  onToggle,
}: {
  label: string
  columnKey: SortKey
  currentKey: SortKey
  direction: "asc" | "desc"
  onToggle: (key: SortKey) => void
}) {
  const isActive = columnKey === currentKey
  const Icon =isActive
    ? direction === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown

  return (
    <button
      type="button"
      onClick={() => onToggle(columnKey)}
      className={cn(
        "inline-flex items-center gap-1 rounded-md text-left font-medium whitespace-nowrap text-foreground transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        !isActive && "text-muted-foreground hover:text-foreground",
      )}
      aria-label={`Sort by ${label}, ${direction === "asc" ? "descending" : "ascending"}`}
    >
      {label}
      <Icon className="size-3.5" />
    </button>
  )
}

export default function DashboardPage() {
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const sortedProjects = useMemo(() => {
    const direction = sortDirection === "asc" ? 1 : -1

    return [...projects].sort((a, b) => {
      if (sortKey === "status") {
        return a.status.localeCompare(b.status) * direction
      }

      const aValue = a[sortKey]
      const bValue = b[sortKey]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * direction
      }

      return String(aValue).localeCompare(String(bValue)) * direction
    })
  }, [sortKey, sortDirection])

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection(current => current === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-h2 leading-h2 font-medium">
          <LayoutDashboard className="mr-2 inline size-5 text-muted-foreground" />
          Dashboard
        </h1>
        <p className="text-small text-muted-foreground">
          Placeholder data for demo purposes.

        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-h2 leading-h2 font-semibold tabular-nums">
                  {formatNumber(stat.value)}
                </span>
                <Badge variant={trendDirections[index] === "up" ? "success" : "destructive"}>
                  {trendDirections[index] === "up" ? <ArrowUp /> : <ArrowDown />}
                  {trends[index]}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Placeholder project data; sortable columns.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortButton label="Name" columnKey="name" currentKey={sortKey} direction={sortDirection} onToggle={toggleSort} />
                  </TableHead>
                  <TableHead>
                    <SortButton label="Requests" columnKey="requests" currentKey={sortKey} direction={sortDirection} onToggle={toggleSort} />
                  </TableHead>
                  <TableHead>
                    <SortButton label="Latency" columnKey="latencyMs" currentKey={sortKey} direction={sortDirection} onToggle={toggleSort} />
                  </TableHead>
                  <TableHead>
                    <SortButton label="Status" columnKey="status" currentKey={sortKey} direction={sortDirection} onToggle={toggleSort} />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProjects.map(project => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Avatar size="sm">
                          <AvatarFallback>{project.ownerInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{project.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {project.owner} · {project.environment}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono tabular-nums">{formatNumber(project.requests)}</TableCell>
                    <TableCell className="font-mono tabular-nums">{project.latencyMs}ms</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant[project.status]}>{statusLabels[project.status]}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project overview</CardTitle>
            <CardDescription>Placeholder component demos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Environment</span>
                    <Badge variant="secondary">staging</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Owner</span>
                    <span className="font-medium">Ada Lovelace</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Region</span>
                    <span className="font-medium">us-east-1</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="activity">
                <ul className="flex flex-col gap-2 text-small">
                  <li className="flex items-center gap-2">
                    <Badge variant="success" className="size-1.5 rounded-full p-0" aria-hidden />
                    Deployed 4 minutes ago</li>
                  <li className="flex items-center gap-2">
                    <Badge variant="warning" className="size-1.5 rounded-full p-0" aria-hidden />
                    CPU usage spiked 2 hours ago</li>
                  <li className="flex items-center gap-2">
                    <Badge variant="destructive" className="size-1.5 rounded-full p-0" aria-hidden />
                    Build failed yesterday</li>
                </ul>
              </TabsContent>
            </Tabs>

            <Separator className="my-4" />

            <div className="flex flex-wrap items-center gap-2">
              <Tooltip>
                <TooltipTrigger render={<Button size="sm" variant="outline" />}>
                  <PlusIcon />
                  New project
                </TooltipTrigger>
                <TooltipContent>Create a project from a template</TooltipContent>
              </Tooltip>

              <Dialog>
                <DialogTrigger render={<Button size="sm" />}>
                  Reset data
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset demo data?</DialogTitle>
                    <DialogDescription>
                      This restores the placeholder projects to their initial state.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" size="sm">Cancel</Button>
                    <Button size="sm">Reset</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
