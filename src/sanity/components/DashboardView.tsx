import React, { useState, useEffect } from "react";
import { Card, Stack, Text, Grid, Button, Heading, Inline, Badge, Spinner } from "@sanity/ui";
import { MessageSquare, Users, RefreshCw, CheckCircle } from "lucide-react";
import { useClient } from "sanity";
import { triggerHomeRevalidate } from "@/lib/studio-actions";

export function DashboardView() {
  const client = useClient({ apiVersion: "2023-01-01" });
  const [stats, setStats] = useState({ leads: 0, subscribers: 0 });
  const [loading, setLoading] = useState(true);
  const [revalidating, setRevalidating] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const leads = await client.fetch('count(*[_type == "contactLead"])');
        const subscribers = await client.fetch('count(*[_type == "newsletterSubscriber"])');
        setStats({ leads, subscribers });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [client]);

  const handleRevalidate = async () => {
    setRevalidating(true);
    try {
      // Server Action authorized by the admin JWT cookie — no secret in the
      // client bundle (the old NEXT_PUBLIC_ token was shipping to browsers).
      const result = await triggerHomeRevalidate();
      if (result.ok) {
        alert("Revalidation triggered successfully!");
      } else {
        alert(`Failed to revalidate: ${result.error ?? "unknown error"}`);
      }
    } catch {
      alert("Failed to revalidate.");
    } finally {
      setRevalidating(false);
    }
  };

  if (loading) return (
    <Card padding={4} display="flex" style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner />
    </Card>
  );

  return (
    <Card padding={4} height="fill" tone="transparent">
      <Stack space={5}>
        <Card borderBottom style={{ paddingBottom: '1rem' }}>
          <Heading size={3}>MAWT Command Center Dashboard</Heading>
          <Text size={1} muted style={{ marginTop: '0.5rem' }}>Real-time platform performance and inbound metrics.</Text>
        </Card>

        <Grid columns={[1, 1, 3]} gap={4}>
          <Card padding={4} border radius={3} shadow={1}>
            <Stack space={3}>
              <Inline space={2}>
                <MessageSquare size={20} />
                <Text weight="bold">Total Leads</Text>
              </Inline>
              <Heading size={4}>{stats.leads}</Heading>
              <Badge tone="positive">High Intent</Badge>
            </Stack>
          </Card>

          <Card padding={4} border radius={3} shadow={1}>
            <Stack space={3}>
              <Inline space={2}>
                <Users size={20} />
                <Text weight="bold">Subscribers</Text>
              </Inline>
              <Heading size={4}>{stats.subscribers}</Heading>
              <Badge tone="primary">Growth: Active</Badge>
            </Stack>
          </Card>

          <Card padding={4} border radius={3} shadow={1} tone="caution">
            <Stack space={3}>
              <Inline space={2}>
                <RefreshCw size={20} />
                <Text weight="bold">System Cache</Text>
              </Inline>
              <Button 
                fontSize={1}
                padding={3}
                text={revalidating ? "Purging..." : "Purge All Cache"}
                onClick={handleRevalidate}
                disabled={revalidating}
                tone="critical"
              />
              <Text size={1} muted>Triggers global ISR revalidation.</Text>
            </Stack>
          </Card>
        </Grid>

        <Card border radius={3} padding={4} style={{ marginTop: '1rem', background: '#f8f9fa' }}>
          <Stack space={3}>
            <Heading size={1}>Quick Status</Heading>
            <Inline space={3}>
              <Inline space={1}>
                <CheckCircle size={14} color="green" />
                <Text size={1}>Sanity API: Operational</Text>
              </Inline>
              <Inline space={1}>
                <CheckCircle size={14} color="green" />
                <Text size={1}>Webhooks: Active</Text>
              </Inline>
              <Inline space={1}>
                <CheckCircle size={14} color="green" />
                <Text size={1}>Rate Limiting: Normal</Text>
              </Inline>
            </Inline>
          </Stack>
        </Card>
      </Stack>
    </Card>
  );
}
