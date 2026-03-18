import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Users, Target, BarChart3, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

// SimOffice API client
const simOfficeApi = {
  getStatus: async () => {
    const response = await fetch("http://localhost:3001/api/simoffice/status", {
      headers: {
        "Authorization": "Bearer test-token", // TODO: Replace with actual token
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
  getAgents: async () => {
    const response = await fetch("http://localhost:3001/api/simoffice/agents", {
      headers: {
        "Authorization": "Bearer test-token",
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
  getProjects: async () => {
    const response = await fetch("http://localhost:3001/api/simoffice/projects", {
      headers: {
        "Authorization": "Bearer test-token",
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
};

interface SimOfficeStatus {
  online: boolean;
  version: string;
  agents: number;
  projects: number;
  uptime: string;
}

interface SimOfficeAgent {
  id: string;
  name: string;
  status: "active" | "idle" | "error";
  role: string;
  lastActivity: string;
}

interface SimOfficeProject {
  id: string;
  name: string;
  status: "planning" | "active" | "completed" | "blocked";
  progress: number;
  agents: number;
  deadline?: string;
}

export function SimOffice() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch SimOffice status
  const statusQuery = useQuery({
    queryKey: ["simoffice", "status"],
    queryFn: simOfficeApi.getStatus,
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 2,
  });

  // Fetch agents
  const agentsQuery = useQuery({
    queryKey: ["simoffice", "agents"],
    queryFn: simOfficeApi.getAgents,
    enabled: activeTab === "agents",
  });

  // Fetch projects
  const projectsQuery = useQuery({
    queryKey: ["simoffice", "projects"],
    queryFn: simOfficeApi.getProjects,
    enabled: activeTab === "projects",
  });

  const isLoading = statusQuery.isLoading;
  const error = statusQuery.error;

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to connect to SimOffice backend. Please ensure the SimOffice server is running on port 3001.
            <div className="mt-2 text-sm">
              Error: {error instanceof Error ? error.message : "Unknown error"}
            </div>
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => statusQuery.refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SimOffice Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your simulated office environment
          </p>
        </div>
        <div className="flex items-center gap-2">
          {statusQuery.data && (
            <Badge variant={statusQuery.data.online ? "default" : "destructive"}>
              {statusQuery.data.online ? "Online" : "Offline"}
            </Badge>
          )}
          <Button
            onClick={() => {
              statusQuery.refetch();
              agentsQuery.refetch();
              projectsQuery.refetch();
            }}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : statusQuery.data ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {statusQuery.data.online ? "Online" : "Offline"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Version {statusQuery.data.version}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statusQuery.data.agents}</div>
                    <p className="text-xs text-muted-foreground">
                      Connected to SimOffice
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statusQuery.data.projects}</div>
                    <p className="text-xs text-muted-foreground">
                      In progress
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statusQuery.data.uptime}</div>
                    <p className="text-xs text-muted-foreground">
                      Since last restart
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Manage your SimOffice environment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button>Start New Project</Button>
                    <Button variant="outline">Add Agent</Button>
                    <Button variant="outline">View Logs</Button>
                    <Button variant="outline">Export Data</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          {agentsQuery.isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : agentsQuery.data ? (
            <div className="space-y-3">
              {agentsQuery.data.map((agent: SimOfficeAgent) => (
                <Card key={agent.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">{agent.role}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Last activity: {agent.lastActivity}
                        </div>
                      </div>
                      <Badge
                        variant={
                          agent.status === "active"
                            ? "default"
                            : agent.status === "idle"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {agent.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No agent data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          {projectsQuery.isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-2 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : projectsQuery.data ? (
            <div className="space-y-3">
              {projectsQuery.data.map((project: SimOfficeProject) => (
                <Card key={project.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{project.name}</div>
                        <Badge
                          variant={
                            project.status === "active"
                              ? "default"
                              : project.status === "completed"
                              ? "outline"
                              : project.status === "blocked"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{project.agents} agents</span>
                        {project.deadline && <span>Due: {project.deadline}</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No project data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                SimOffice performance metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}