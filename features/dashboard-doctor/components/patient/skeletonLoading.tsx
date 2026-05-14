import {Fragment} from 'react'
import { Box, Card, CardContent, Divider, Grid, Skeleton } from "@mui/material";

export const DoctorPatientSkeleton = () => {
  return (
    <Fragment>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width={140} height={36} />
            <Divider sx={{ my: 1 }} />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width={150} height={36} />
            <Divider sx={{ my: 1 }} />
            <Skeleton variant="rectangular" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={28} />
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width={120} height={30} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={220} />
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ mt: 2, width: "100%" }}>
          <CardContent>
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Skeleton variant="rounded" width={120} height={36} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Fragment>
  );
};